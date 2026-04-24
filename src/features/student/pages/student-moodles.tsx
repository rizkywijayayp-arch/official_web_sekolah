import React, { useMemo } from 'react';
import { StudentMoodleTable } from '../containers';
import { useParamDecode } from '@/features/_global';
import { useBiodata } from '@/features/user/hooks';

export const StudentMoodles = React.memo(() => {
  const { decodeParams } = useParamDecode();
  const biodata = useBiodata();

  // Log untuk decodeParams
  

  // Ambil ID siswa dari decodeParams
  const studentId = decodeParams?.id;
  

  // Log data biodata yang diterima
  

  // Cari data siswa di biodata berdasarkan ID
  const detail = useMemo(() => {
    const student = biodata.data?.find((d) => d.id === Number(studentId));
    

    if (!student) {
      
      return null;
    }

    const detailData = {
      id: student.id,
      data: {
        user: {
          sekolahId: student.user?.sekolah?.id || 0,
          nis: Number(student.user?.nis) || 0, // Konversi ke number
        },
      },
    };

    // Log detail data yang dikonstruksi
    
    return detailData;
  }, [biodata.data, studentId]);

  if (!detail) {
    
    return <div>Data siswa tidak ditemukan. Silakan cek kembali.</div>;
  }

  // Log detail data yang diteruskan ke StudentMoodleTable
  

  return (
    <div>
      {/* Render tabel dengan data siswa */}
      <StudentMoodleTable detail={detail} />
    </div>
  );
});

export default StudentMoodles;
