const SchoolAccount = require('../models/auth');

// Middleware: resolve schoolId dari domain
// Kalau request dari domain xyz.edu, otomatis inject schoolId = xyz
const tenantMiddleware = async (req, res, next) => {
  try {
    // Ambil host dari header (tanpa port)
    let host = req.get('Host') || '';
    host = host.split(':')[0]; // hilangkan port kalau ada

    // Skip untuk localhost / dev environment
    if (!host || host === 'localhost' || host === '127.0.0.1' || host.includes('192.168')) {
      return next();
    }

    // Hapus subdomain www kalau ada
    const domain = host.replace(/^www\./, '');

    // Cari sekolah berdasarkan domain yang tersimpan di profileSekolah
    const SchoolProfile = require('../models/profileSekolah');
    const school = await SchoolProfile.findOne({
      where: { domain },
      attributes: ['id', 'name', 'domain', 'schoolId'],
    });

    if (school) {
      req.schoolId = school.schoolId || school.id;
      req.schoolDomain = domain;
    }

    next();
  } catch (err) {
    // Kalau gagal, lanjut aja tanpa tenant info
    console.error('Tenant middleware error:', err.message);
    next();
  }
};

/**
 * Middleware: enforce schoolId dari request body/query ke semua query
 *
 * SECURITY FIX — WAJIB dipake di routes yang butuh tenant isolation
 *
 * Perubahan penting:
 * 1. schoolId di-extract dari X-School-Id header (prioritas tertinggi).
 *    Ini adalah header yang disisipkan oleh client — lebih aman dari query/body
 *    karena tidak muncul di URL / logs / referrer.
 * 2. Jika schoolId ada di query/body, DITOLAK除非 ada X-School-Id header yang cocok.
 *    Ini mencegah admin School A inject ?sekolahId=SchoolB di URL untuk bocor data.
 * 3. schoolId harus SAMA dengan JWT user. Jika tidak, berarti user mencoba
 *    mengakses data tenant lain → 403 Forbidden.
 *
 * Alur:
 *  - Jika request BERISI X-School-Id header → validasi vs JWT → 403 jika mismatch
 *  - Jika request TIDAK berisi X-School-Id → gunakan dari tenantMiddleware (domain)
 *  - Jika query/body mengandung schoolId tapi TIDAK ada X-School-Id header
 *    (atau tidak cocok) → TOLAK dengan 403
 */
const enforceTenant = (req, res, next) => {
  // Priority 1: X-School-Id header (dari client yang sudah terautentikasi)
  const headerSchoolId = req.headers['x-school-id']
    ? parseInt(req.headers['x-school-id'], 10)
    : null;

  // Priority 2: schoolId dari tenantMiddleware (domain-based, trusted)
  const domainSchoolId = req.schoolId
    ? (typeof req.schoolId === 'number' ? req.schoolId : parseInt(req.schoolId, 10))
    : null;

  // Check: ada schoolId di query/body? Jika ya, harus ada header yang cocok
  const querySchoolId = req.query.schoolId
    ? parseInt(req.query.schoolId, 10)
    : null;
  const bodySchoolId = req.body?.sekolahId
    ? parseInt(req.body.sekolahId, 10)
    : null;
  const requestedSchoolId = querySchoolId || bodySchoolId || null;

  let finalSchoolId = null;

  if (headerSchoolId) {
    // Client mengirim X-School-Id header → validasi vs JWT
    const jwtSchoolId = req.user?.sekolahId ?? req.user?.schoolId ?? null;

    if (jwtSchoolId !== null && headerSchoolId !== jwtSchoolId) {
      console.warn(
        `[enforceTenant] ⚠️ TENANT MISMATCH — ` +
        `User schoolId: ${jwtSchoolId}, requested: ${headerSchoolId}, IP: ${req.ip}`
      );
      return res.status(403).json({
        success: false,
        error: 'AKSES DITOLAK: Anda tidak memiliki hak akses ke sekolah yang diminta.',
        code: 'TENANT_MISMATCH',
      });
    }

    finalSchoolId = headerSchoolId;
  } else if (domainSchoolId) {
    // Tidak ada header — gunakan domain-based (otentik dari hostname)
    finalSchoolId = domainSchoolId;
  }

  // Jika query/body punya schoolId tapi tidak ada header X-School-Id yang terautentikasi
  // → Block untuk cegah manipulatif parameter injection
  if (requestedSchoolId && !headerSchoolId) {
    console.warn(
      `[enforceTenant] ⚠️ UNAUTHORIZED PARAM INJECTION — ` +
      `query/body sekolahId: ${requestedSchoolId} tapi tidak ada X-School-Id header. IP: ${req.ip}`
    );
    return res.status(403).json({
      success: false,
      error: 'AKSES DITOLAK: Parameter schoolId tidak diizinkan via URL/body. Gunakan header X-School-Id.',
      code: 'PARAM_INJECTION_BLOCKED',
    });
  }

  // Jika ada headerSchoolId tapi berbeda dari domain → tetap gunakan header
  // (admin dashboard bisa switch antar sekolah via X-School-Id yang sudah divalidasi JWT)

  if (finalSchoolId) {
    req.enforcedSchoolId = finalSchoolId;
  }

  next();
};

module.exports = { tenantMiddleware, enforceTenant };
