/**
 * Jadwal imunisasi dasar — mengacu pada rekomendasi IDAI 2023
 * (disederhanakan untuk pengingat orang tua, BUKAN pengganti buku KIA).
 * month = usia dalam bulan saat imunisasi dijadwalkan.
 */

export interface ImmunizationItem {
  month: number;
  ageLabel: string;
  vaccines: string[];
  note?: string;
}

export const IMMUNIZATION_SCHEDULE: ImmunizationItem[] = [
  { month: 0, ageLabel: 'Lahir', vaccines: ['Hepatitis B (HB-0)', 'Polio tetes (OPV-0)', 'BCG'], note: 'HB-0 idealnya < 24 jam setelah lahir' },
  { month: 2, ageLabel: '2 bulan', vaccines: ['DPT-HB-Hib 1', 'Polio tetes 1 / IPV', 'PCV 1', 'Rotavirus 1'], note: 'Rotavirus: dosis pertama sebelum usia 15 minggu' },
  { month: 3, ageLabel: '3 bulan', vaccines: ['DPT-HB-Hib 2', 'Polio tetes 2', 'PCV 2'], note: 'Jarak antar DPT minimal 4 minggu' },
  { month: 4, ageLabel: '4 bulan', vaccines: ['DPT-HB-Hib 3', 'Polio tetes 3 / IPV', 'PCV 3', 'Rotavirus 2'] },
  { month: 6, ageLabel: '6 bulan', vaccines: ['Influenza (tahunan)', 'JE (Japanese Encephalitis)*'], note: '*JE di daerah endemis; influenza mulai usia 6 bulan, ulang tiap tahun' },
  { month: 9, ageLabel: '9 bulan', vaccines: ['Campak-Rubella (MR)'] },
  { month: 12, ageLabel: '12 bulan', vaccines: ['PCV booster', 'Varisela (cacar air)', 'Hepatitis A'] },
  { month: 15, ageLabel: '15 bulan', vaccines: ['MMR (lanjutan MR)'], note: 'Bila MR-9 bulan terlewat, kejar sesuai anjuran dokter' },
  { month: 18, ageLabel: '18 bulan', vaccines: ['DPT-HB-Hib booster', 'Polio tetes booster'] },
  { month: 24, ageLabel: '24 bulan', vaccines: ['Tifoid (demam tifoid)'], note: 'Dapat diberikan mulai usia 2 tahun' },
];

export interface ImmunizationStatus extends ImmunizationItem {
  status: 'done' | 'due' | 'upcoming';
}

export function getImmunizationStatus(babyAgeMonths: number): {
  done: ImmunizationStatus[];
  due: ImmunizationStatus | null;
  upcoming: ImmunizationStatus[];
} {
  const age = Math.max(0, Math.min(24, Math.floor(babyAgeMonths)));
  const done: ImmunizationStatus[] = [];
  let due: ImmunizationStatus | null = null;
  const upcoming: ImmunizationStatus[] = [];

  for (const item of IMMUNIZATION_SCHEDULE) {
    if (item.month < age) done.push({ ...item, status: 'done' });
    else if (item.month === age && !due) due = { ...item, status: 'due' };
    else if (item.month === age && due) upcoming.push({ ...item, status: 'upcoming' });
    else upcoming.push({ ...item, status: 'upcoming' });
  }

  // Bila usia tepat di antara dua jadwal (misal 1, 5, 7 bulan),
  // jadwal terdekat berikutnya dianggap "due" agar tidak kosong.
  if (!due && upcoming.length > 0) {
    const [next, ...rest] = upcoming;
    due = { ...next, status: 'due' };
    return { done, due, upcoming: rest };
  }

  return { done, due, upcoming };
}
