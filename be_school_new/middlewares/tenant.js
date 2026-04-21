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

// Middleware: enforce schoolId dari request body/query ke semua query
// WAJIB dipake di routes yang butuh tenant isolation
const enforceTenant = (req, res, next) => {
  // Priority: query > body > header > tenantMiddleware result
  const schoolId =
    req.query.schoolId ||
    req.body.schoolId ||
    req.headers['x-school-id'] ||
    req.schoolId;

  if (schoolId) {
    req.enforcedSchoolId = parseInt(schoolId);
  }

  next();
};

module.exports = { tenantMiddleware, enforceTenant };
