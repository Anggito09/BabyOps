export type DunstanLabel = 'Neh' | 'Owh' | 'Eh' | 'Eairh' | 'Heh';

export interface DunstanClass {
  label: DunstanLabel;
  meaning: string;
  emoji: string;
  color: string;
  description: string;
  actions: string[];
}

export const dunstanClasses: Record<DunstanLabel, DunstanClass> = {
  Neh: {
    label: 'Neh',
    meaning: 'Lapar',
    emoji: '🍼',
    color: '#2B9BEC',
    description:
      'Tangisan "Neh" muncul dari reflekt hisap saat bayi lapar. Suaranya pendek, berulang, dan rata-rata dengan ritme "ne-ne-ne".',
    actions: [
      'Tawarkan ASI atau susu formula',
      'Periksa waktu menyusu terakhir',
      'Tengkurapkan posisi menyusu agar nyaman',
    ],
  },
  Owh: {
    label: 'Owh',
    meaning: 'Mengantuk',
    emoji: '😴',
    color: '#7A5CF0',
    description:
      'Tangisan "Owh" mirip menguap panjang. Bayi merasa lelah dan siap tidur, biasanya disertai menggosok mata.',
    actions: [
      'Redupkan lampu kamar',
      'Gendong dengan gerakan pelan dan ritmis',
      'Putar white noise atau musik lembut',
    ],
  },
  Eh: {
    label: 'Eh',
    meaning: 'Butuh Sendawa',
    emoji: '🫧',
    color: '#34C77B',
    description:
      'Tangisan "Eh" pendek dan terputus-putus, ditimpa oleh gelembung udara di dada. Bayi butuh dibantu bersendawa.',
    actions: [
      'Tengkurapkan bayi di bahu Anda',
      'Tepuk punggung atas dengan lembut',
      'Tunggu sendawa keluar sebelum melanjutkan aktivitas',
    ],
  },
  Eairh: {
    label: 'Eairh',
    meaning: 'Gas Perut Bawah',
    emoji: '💨',
    color: '#F5A623',
    description:
      'Tangisan "Eairh" intens dan menekan ke bawah, menandakan gelembung udara di perut bawah yang menimbulkan rasa tidak nyaman.',
    actions: [
      'Pijat perut bayi searah jarum jam',
      'Gerakkan kaki bayi seperti bersepeda',
      'Posisikan bayi tengkurap sesaat di bawah pengawasan',
    ],
  },
  Heh: {
    label: 'Heh',
    meaning: 'Tidak Nyaman',
    emoji: '🤲',
    color: '#E85D5D',
    description:
      'Tangisan "Heh" bersifat berulang dan frustrasi. Penyebabnya bervariasi: pop kenas, suhu tubuh, posisi, atau butuh gendongan.',
    actions: [
      'Periksa pop bayi dan ganti jika kenas',
      'Cek suhu ruangan dan pakaian bayi',
      'Ganti posisi atau gendong bayi',
    ],
  },
};

export const dunstanList: DunstanClass[] = [
  dunstanClasses.Neh,
  dunstanClasses.Owh,
  dunstanClasses.Eh,
  dunstanClasses.Eairh,
  dunstanClasses.Heh,
];
