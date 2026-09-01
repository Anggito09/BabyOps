export interface Article {
  id: string;
  title: string;
  category: string;
  readMinutes: number;
  emoji: string;
  excerpt: string;
  body: string[];
}

export const articles: Article[] = [
  {
    id: 'a1',
    title: 'Mengenal 5 Bahasa Tangisan Bayi (Dunstan Baby Language)',
    category: 'Dunstan Baby Language',
    readMinutes: 4,
    emoji: '🗣️',
    excerpt:
      'Tangisan bayi bukan sekadar suara — ada pola yang bisa Anda pelajari untuk memahami kebutuhannya.',
    body: [
      'Priscilla Dunstan menemukan bahwa bayi baru lahir (0-3 bulan) mengeluarkan suara reflektik yang berbeda sebelum menangis penuh, dan setiap suara berkorelasi dengan kebutuhan fisik tertentu.',
      'Neh berarti lapar, muncul dari reflekt hisap. Owh menandakan kantuk dengan bunyi mirip menguap. Eh adalah sinyal butuh sendawa karena gelembung udara di dada.',
      'Eairh menunjukkan gas di perut bawah dengan tangisan menekan ke bawah, sedangkan Heh menandakan ketidaknyamanan umum seperti pop kenas atau suhu yang kurang pas.',
      'Kuncinya adalah mendengarkan suara awal sebelum tangisan mengeras. Semakin cepat Anda mengenali, semakin mudah menenangkan bayi.',
    ],
  },
  {
    id: 'a2',
    title: 'Panduan Menyusui yang Nyaman untuk Ibu & Bayi',
    category: 'Nutrisi',
    readMinutes: 5,
    emoji: '🍼',
    excerpt:
      'Posisi yang tepat membuat menyusu lebih efektif dan bayi lebih tenang setelah kenyang.',
    body: [
      'Pastikan seluruh tubuh bayi menghadap Anda — telinga, bahu, dan pinggul membentuk satu garis lurus.',
      'Tengkurapkan bayi menghadap payudara, bukan memutar kepalanya. Tunggu mulut terbuka lebar sebelum menyusukan.',
      'Setelah menyusu, tengkurapkan bayi di bahu dan tepuk punggung atas dengan lembut hingga sendawa keluar untuk mencegah gas.',
    ],
  },
  {
    id: 'a3',
    title: 'Tanda Bahaya pada Bayi yang Wajib Diketahui Orang Tua',
    category: 'Kesehatan',
    readMinutes: 6,
    emoji: '🚨',
    excerpt:
      'Beberapa gejala pada bayi tidak boleh ditunggu. Kenali tanda-tandanya sejak dini.',
    body: [
      'Segera cari pertolongan medis bila bayi di bawah 3 bulan memiliki suhu di atas 38°C atau di bawah 36°C.',
      'Perhatikan pola napas: napas lebih cepat dari 60 kali per menit, dada tertarik ke dalam, atau bibir kebiruan adalah tanda darurat.',
      'Bayi yang lemas, menolak menyusu total, muntah menyemburkan, atau kejang juga butuh penanganan segera.',
      'Percaya insting Anda — bila merasa ada yang tidak beres dengan bayi, bawa ke fasilitas kesehatan.',
    ],
  },
  {
    id: 'a4',
    title: 'Membangun Rutinitas Tidur Bayi yang Lebih Baik',
    category: 'Tidur',
    readMinutes: 4,
    emoji: '🌙',
    excerpt:
      'Rutinitas sederhana sebelum tidur membantu bayi lebih cepat tenang dan tidur lebih nyenyak.',
    body: [
      'Buat urutan aktivitas yang sama setiap malam: mandi hangat, pijat lembut, pakaian tidur, lalu menyusu dalam ruangan redup.',
      'Bedakan siang dan malam — siang terang dan ramai, malam gelap dan tenang, agar jam biologis bayi terbentuk.',
      'Letakkan bayi saat mengantuk tapi belum tertidur penuh agar ia belajar tertidur sendiri di kasurnya.',
    ],
  },
  {
    id: 'a5',
    title: 'Perawatan Pop yang Sehat & Bebas Ruam',
    category: 'Perawatan',
    readMinutes: 3,
    emoji: '🧷',
    excerpt:
      'Ruam pop kenas paling sering disebabkan kelembapan dan gesekan. Ini cara mencegahnya.',
    body: [
      'Ganti pop segera setelah kenas — bayi baru lahir bisa buang air kecil hingga 10 kali sehari.',
      'Bersihkan dengan air hangat dan kapas lembut, keringkan dengan menepuk bukan menggosok.',
      'Berikan waktu tanpa pop beberapa jam sehari agar kulit bernapas, dan gunakan krim pelindung bila perlu.',
    ],
  },
  {
    id: 'a6',
    title: 'Stimulasi Tumbuh Kembang Bayi 0-6 Bulan',
    category: 'Tumbuh Kembang',
    readMinutes: 5,
    emoji: '🌱',
    excerpt:
      'Interaksi sederhana setiap hari berperan besar pada perkembangan otak bayi Anda.',
    body: [
      'Ajak bayi bicara sambil menatap matanya — bayi paling fokus pada jarak 20-30 cm, tepat jarak wajah saat menyusu.',
      'Berikan waktu tengkurap (tummy time) beberapa menit setiap hari untuk menguatkan otot leher dan punggung.',
      'Perkenalkan tekstur, suara lembut, dan lagu. Pengulangan yang hangat membangun rasa aman dan kemampuan belajar.',
    ],
  },
];
