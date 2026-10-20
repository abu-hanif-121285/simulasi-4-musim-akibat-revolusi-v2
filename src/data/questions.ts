import type { OrbitKey } from "./astronomy";

export type DiagramKey = "north-summer" | "south-summer" | "rays" | "orbit" | "tilt";

export type PracticeQuestion =
  | {
      id: number;
      type: "mc";
      topic: string;
      prompt: string;
      options: string[];
      correct: number;
      explanation: string;
      visual?: DiagramKey;
    }
  | {
      id: number;
      type: "tf";
      topic: string;
      prompt: string;
      correct: boolean;
      explanation: string;
      visual?: DiagramKey;
    }
  | {
      id: number;
      type: "matching";
      topic: string;
      prompt: string;
      pairs: { left: string; right: string }[];
      explanation: string;
    }
  | {
      id: number;
      type: "ordering";
      topic: string;
      prompt: string;
      items: string[];
      correctOrder: string[];
      explanation: string;
    };

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    type: "mc",
    topic: "Sumbu dan kemiringan",
    prompt:
      "Sumbu Bumi miring sekitar berapa derajat, dan diukur dari garis apa?",
    options: [
      "23,5° dari garis tegak lurus terhadap bidang orbit",
      "23,5° dari permukaan bidang orbit",
      "66,5° dari garis tegak lurus terhadap bidang orbit",
      "23,5° dari arah Matahari",
    ],
    correct: 0,
    explanation:
      "Angka 23,5° adalah sudut antara sumbu Bumi dan garis tegak lurus terhadap bidang orbit. Sudut terhadap bidang orbit sekitar 66,5°.",
    visual: "tilt",
  },
  {
    id: 2,
    type: "mc",
    topic: "Musim dan belahan Bumi",
    prompt:
      "Perhatikan diagram. Kutub Utara condong ke arah Matahari. Musim apa yang umumnya dialami belahan Bumi Utara di wilayah beriklim sedang?",
    options: ["Semi", "Panas", "Gugur", "Dingin"],
    correct: 1,
    explanation:
      "Ketika belahan Utara condong ke arah Matahari, sinar datang lebih langsung dan siang lebih panjang. Di wilayah beriklim sedang, belahan Utara mengalami musim panas.",
    visual: "north-summer",
  },
  {
    id: 3,
    type: "mc",
    topic: "Musim yang berlawanan",
    prompt:
      "Mengapa belahan Utara dan Selatan umumnya mengalami musim yang berlawanan?",
    options: [
      "Karena kedua belahan berputar ke arah yang berbeda",
      "Karena saat satu belahan condong ke Matahari, belahan lain menjauh sehingga penyinaran dan lama siangnya berbeda",
      "Karena jarak kedua belahan ke Matahari selalu berbeda jauh",
      "Karena Bulan menghalangi sinar Matahari ke salah satu belahan",
    ],
    correct: 1,
    explanation:
      "Kemiringan sumbu membuat satu belahan lebih condong ke Matahari, sedangkan belahan lainnya menjauh. Keduanya tidak bisa condong paling dekat pada waktu yang sama.",
  },
  {
    id: 4,
    type: "mc",
    topic: "Revolusi Bumi",
    prompt: "Apa yang dimaksud dengan revolusi Bumi?",
    options: [
      "Perputaran Bumi pada sumbunya dalam 24 jam",
      "Gerakan Bumi mengelilingi Matahari selama sekitar 365¼ hari",
      "Perubahan kemiringan sumbu Bumi setiap bulan",
      "Gerakan Matahari mengelilingi Bumi setiap hari",
    ],
    correct: 1,
    explanation:
      "Revolusi adalah peredaran Bumi mengelilingi Matahari. Satu kali revolusi memerlukan sekitar 365¼ hari, yang menjadi dasar tahun kalender.",
  },
  {
    id: 5,
    type: "tf",
    topic: "Jarak Bumi–Matahari",
    prompt:
      "Bumi lebih dekat ke Matahari pada bulan Juni, jadi jarak itulah penyebab utama musim panas di belahan Utara.",
    correct: false,
    explanation:
      "Mitos. Bumi justru berada dekat Matahari sekitar awal Januari. Musim terutama disebabkan oleh kemiringan sumbu dan sudut penyinaran, bukan terutama oleh perubahan jarak.",
  },
  {
    id: 6,
    type: "mc",
    topic: "Penyinaran dan lama siang",
    prompt:
      "Bagaimana sinar yang lebih langsung dan siang yang lebih panjang bekerja bersama?",
    options: [
      "Sinar langsung membuat Bumi berhenti berputar",
      "Keduanya membuat lebih banyak energi Matahari diterima per satuan luas selama sehari",
      "Siang panjang membuat gravitasi Matahari bertambah",
      "Keduanya membuat suhu seluruh Bumi pasti sama",
    ],
    correct: 1,
    explanation:
      "Sinar yang lebih langsung memusatkan energi pada area yang lebih kecil. Siang yang lebih panjang memberi waktu penyinaran lebih lama. Keduanya membuat energi harian yang diterima bertambah di belahan tersebut.",
  },
  {
    id: 7,
    type: "mc",
    topic: "Iklim Indonesia",
    prompt: "Pernyataan yang paling tepat tentang musim di Indonesia adalah ...",
    options: [
      "Indonesia memiliki empat musim seperti Eropa",
      "Indonesia umumnya memiliki musim hujan dan kemarau yang dipengaruhi angin muson dan pola curah hujan",
      "Indonesia tidak memiliki perbedaan curah hujan sama sekali",
      "Indonesia selalu mengalami musim panas karena berada di dekat khatulistiwa",
    ],
    correct: 1,
    explanation:
      "Indonesia beriklim tropis. Kedua musim utamanya adalah musim hujan dan kemarau. Polanya sangat dipengaruhi angin muson, distribusi curah hujan, dan sirkulasi atmosfer.",
  },
  {
    id: 8,
    type: "mc",
    topic: "Ekuinoks dan solstis",
    prompt: "Apa ciri utama ekuinoks?",
    options: [
      "Salah satu kutub paling condong ke Matahari",
      "Di banyak wilayah, lama siang dan malam relatif hampir sama",
      "Bumi berada paling jauh dari Matahari",
      "Matahari berhenti bergerak di langit",
    ],
    correct: 1,
    explanation:
      "Saat ekuinoks, sumbu Bumi tidak condong paling dekat ke Matahari. Di banyak wilayah, lama siang dan malam relatif hampir sama.",
  },
  {
    id: 9,
    type: "tf",
    topic: "Ekuinoks dan solstis",
    prompt:
      "Pada sekitar Juni, belahan Utara memiliki siang terpanjang dalam siklus tahunannya di banyak wilayah.",
    correct: true,
    explanation:
      "Benar. Saat Solstis Juni, Kutub Utara condong ke arah Matahari sehingga wilayah belahan Utara memiliki siang yang lebih panjang.",
  },
  {
    id: 10,
    type: "mc",
    topic: "Eksperimen kemiringan",
    prompt:
      "Jika kemiringan sumbu Bumi menjadi 0°, apa yang paling mungkin terjadi pada pola musim di lintang menengah?",
    options: [
      "Perbedaan musiman menjadi jauh lebih kecil dibandingkan kondisi sekarang",
      "Musim panas menjadi dua kali lebih panas karena Bumi tegak",
      "Semua wilayah Bumi akan bersuhu sama sepanjang tahun",
      "Matahari akan mengelilingi Bumi, bukan sebaliknya",
    ],
    correct: 0,
    explanation:
      "Tanpa kemiringan, perbedaan sudut penyinaran antara belahan Utara dan Selatan sepanjang tahun jauh lebih kecil. Pola empat musim seperti sekarang tidak akan sama. Suhu tetap dipengaruhi lintang dan kondisi iklim.",
  },
  {
    id: 11,
    type: "matching",
    topic: "Istilah astronomi",
    prompt: "Pasangkan istilah berikut dengan pengertian yang tepat.",
    pairs: [
      { left: "Rotasi", right: "Perputaran Bumi pada sumbunya" },
      { left: "Revolusi", right: "Peredaran Bumi mengelilingi Matahari" },
      { left: "Ekuinoks", right: "Siang dan malam relatif hampir sama" },
      { left: "Solstis", right: "Matahari tampak mencapai posisi paling utara atau selatan" },
    ],
    explanation:
      "Rotasi menghasilkan pergantian siang-malam. Revolusi bersama kemiringan sumbu menghasilkan perubahan penyinaran antarmusim. Ekuinoks terjadi di sekitar Maret dan September, sedangkan solstis di sekitar Juni dan Desember.",
  },
  {
    id: 12,
    type: "ordering",
    topic: "Urutan musim",
    prompt:
      "Urutkan musim belahan Bumi Utara dari posisi Maret, mengikuti perjalanan revolusi Bumi.",
    items: ["Gugur", "Semi", "Dingin", "Panas"],
    correctOrder: ["Semi", "Panas", "Gugur", "Dingin"],
    explanation:
      "Dari ekuinoks Maret, belahan Utara mengalami semi, lalu panas setelah Solstis Juni, gugur setelah ekuinoks September, dan dingin setelah Solstis Desember.",
  },
];

export type QuizQuestion = {
  id: number;
  topic: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: "Sumbu Bumi",
    prompt: "Apa yang disebut sumbu Bumi?",
    options: [
      "Garis khatulistiwa yang membagi Bumi menjadi dua",
      "Garis khayal yang melewati Kutub Utara dan Kutub Selatan, menjadi poros rotasi",
      "Lintasan Bumi saat mengelilingi Matahari",
      "Garis yang menghubungkan Bumi dan Matahari",
    ],
    correct: 1,
    explanation:
      "Sumbu Bumi adalah garis khayal yang melalui kedua kutub dan menjadi poros saat Bumi berotasi.",
  },
  {
    id: 2,
    topic: "Kemiringan sumbu",
    prompt: "Besar kemiringan sumbu Bumi adalah sekitar ...",
    options: ["12,5°", "23,5°", "30°", "66,5°"],
    correct: 1,
    explanation:
      "Sumbu Bumi miring sekitar 23,5° dari garis tegak lurus terhadap bidang orbit.",
  },
  {
    id: 3,
    topic: "Kemiringan sumbu",
    prompt: "Sudut 23,5° pada kemiringan sumbu Bumi diukur dari ...",
    options: [
      "permukaan tanah di khatulistiwa",
      "garis tegak lurus terhadap bidang orbit Bumi",
      "garis yang sejajar dengan bidang orbit",
      "arah rotasi harian Matahari",
    ],
    correct: 1,
    explanation:
      "Acuan yang benar adalah garis tegak lurus terhadap bidang orbit. Terhadap bidang orbit, sudutnya sekitar 66,5°.",
  },
  {
    id: 4,
    topic: "Revolusi Bumi",
    prompt: "Satu kali revolusi Bumi memerlukan waktu sekitar ...",
    options: ["24 jam", "30 hari", "365¼ hari", "12 tahun"],
    correct: 2,
    explanation:
      "Revolusi Bumi mengelilingi Matahari memerlukan sekitar 365¼ hari. Sisa seperempat hari diakumulasikan dalam tahun kabisat.",
  },
  {
    id: 5,
    topic: "Penyebab musim",
    prompt: "Penyebab utama pergantian musim di wilayah beriklim sedang adalah ...",
    options: [
      "perubahan jarak Bumi ke Matahari",
      "kombinasi kemiringan sumbu Bumi dan revolusi Bumi",
      "gerhana Matahari yang terjadi setiap bulan",
      "perubahan jumlah Bulan yang mengelilingi Bumi",
    ],
    correct: 1,
    explanation:
      "Kemiringan sumbu membuat sudut penyinaran dan lama siang berubah saat Bumi berevolusi. Jarak Bumi–Matahari bukan penyebab utama.",
  },
  {
    id: 6,
    topic: "Musim belahan Utara",
    prompt: "Pada sekitar Juni, kondisi belahan Bumi Utara umumnya adalah ...",
    options: [
      "condong ke arah Matahari, siang lebih panjang, dan wilayah beriklim sedang mengalami panas",
      "condong menjauh dari Matahari, siang lebih pendek, dan mengalami dingin",
      "tegak lurus tanpa kemiringan",
      "mengalami ekuinoks dengan siang yang selalu 12 jam",
    ],
    correct: 0,
    explanation:
      "Sekitar Juni, Kutub Utara condong ke Matahari. Sinar lebih langsung dan siang lebih panjang sehingga belahan Utara memasuki musim panas.",
  },
  {
    id: 7,
    topic: "Musim belahan Selatan",
    prompt: "Pada sekitar Desember, belahan Bumi Selatan mengalami ...",
    options: ["Dingin, karena menjauh dari Matahari", "Panas, karena condong ke arah Matahari", "Semi, karena baru melewati solstis", "Tidak ada perubahan"],
    correct: 1,
    explanation:
      "Sekitar Desember, Kutub Selatan condong ke Matahari. Belahan Selatan mengalami musim panas, sedangkan belahan Utara mengalami musim dingin.",
  },
  {
    id: 8,
    topic: "Ekuinoks",
    prompt: "Apa yang dimaksud dengan ekuinoks?",
    options: [
      "Saat Bumi paling dekat ke Matahari",
      "Saat Matahari berada tepat di atas khatulistiwa dan lama siang-malam di banyak wilayah hampir sama",
      "Saat salah satu kutub terus-menerus mendapat siang",
      "Saat Bumi berhenti berevolusi",
    ],
    correct: 1,
    explanation:
      "Ekuinoks terjadi sekitar Maret dan September. Di banyak wilayah, lama siang dan malam relatif hampir seimbang.",
  },
  {
    id: 9,
    topic: "Solstis",
    prompt: "Pada Solstis Juni, belahan Bumi Utara memiliki ...",
    options: [
      "malam terpanjang dalam setahun",
      "siang terpanjang dalam setahun di banyak wilayah",
      "lama siang dan malam yang selalu sama",
      "musim dingin yang paling dingin",
    ],
    correct: 1,
    explanation:
      "Solstis Juni menandai siang terpanjang di belahan Utara dan siang terpendek di belahan Selatan. Tanggalnya dapat bergeser sedikit tiap tahun.",
  },
  {
    id: 10,
    topic: "Musim berlawanan",
    prompt: "Mengapa belahan Utara dan Selatan umumnya memiliki musim berlawanan?",
    options: [
      "Karena keduanya menjauh dari Matahari pada waktu yang sama",
      "Karena ketika satu belahan condong ke Matahari, belahan lain condong menjauh",
      "Karena Bumi berganti arah revolusi dua kali setahun",
      "Karena sinar Matahari hanya mengenai satu belahan",
    ],
    correct: 1,
    explanation:
      "Dalam satu waktu, hanya satu belahan yang condong paling dekat ke Matahari. Belahan lain menerima sinar lebih miring dan siang lebih pendek.",
  },
  {
    id: 11,
    topic: "Jarak Bumi–Matahari",
    prompt:
      "Pernyataan yang paling tepat tentang hubungan jarak Bumi–Matahari dengan musim adalah ...",
    options: [
      "Bumi paling dekat ke Matahari pada Juni sehingga terjadi musim panas di Utara",
      "Perubahan jarak bukan penyebab utama musim; sudut penyinaran dan lama siang lebih menentukan",
      "Jarak Bumi–Matahari tetap sama sepanjang tahun",
      "Musim hanya ditentukan oleh jarak, kemiringan tidak berpengaruh",
    ],
    correct: 1,
    explanation:
      "Orbit Bumi memang sedikit elips, tetapi musim bukan terutama disebabkan perubahan jarak. Bumi terdekat ke Matahari sekitar awal Januari.",
  },
  {
    id: 12,
    topic: "Iklim Indonesia",
    prompt: "Indonesia umumnya memiliki dua musim utama, yaitu ...",
    options: [
      "semi dan panas",
      "hujan dan kemarau, dipengaruhi angin muson serta pola curah hujan",
      "gugur dan dingin",
      "panas dan salju",
    ],
    correct: 1,
    explanation:
      "Sebagai wilayah tropis dekat khatulistiwa, Indonesia umumnya memiliki musim hujan dan kemarau. Atmosfer, angin muson, dan distribusi hujan memengaruhi pola tersebut.",
  },
  {
    id: 13,
    topic: "Penyinaran dan energi",
    prompt: "Mengapa sinar Matahari yang datang lebih tegak memanaskan permukaan lebih terkonsentrasi?",
    options: [
      "Karena jumlah sinar Matahari bertambah dari Matahari",
      "Karena energi yang sama diterima pada area yang lebih kecil, sehingga energi per satuan luas lebih besar",
      "Karena sinar tegak bergerak lebih lambat",
      "Karena permukaan Bumi berhenti berputar saat siang",
    ],
    correct: 1,
    explanation:
      "Berkas sinar dengan energi yang sama yang jatuh tegak tersebar pada area kecil. Jika datang miring, area yang terkena lebih luas sehingga energinya lebih tersebar.",
  },
  {
    id: 14,
    topic: "Arah kemiringan sumbu",
    prompt:
      "Dalam model tahunan sederhana, bagaimana arah kemiringan sumbu Bumi selama revolusi?",
    options: [
      "Terus berputar mengikuti arah orbit",
      "Tetap memiliki arah kemiringan yang relatif sama terhadap bintang di latar belakang",
      "Berubah menjadi tegak setiap tiga bulan",
      "Selalu menghadap Matahari secara langsung",
    ],
    correct: 1,
    explanation:
      "Sumbu Bumi mempertahankan arah kemiringan yang relatif tetap selama satu revolusi dalam model sederhana. Inilah yang membuat penyinaran berubah secara musiman.",
  },
  {
    id: 15,
    topic: "Eksperimen kemiringan",
    prompt: "Jika kemiringan sumbu Bumi 0°, apa yang paling tepat?",
    options: [
      "Seluruh Bumi akan selalu bersuhu sama",
      "Perbedaan penyinaran musiman antarbelahan menjadi jauh lebih kecil; pola empat musim seperti sekarang tidak akan sama",
      "Bumi tidak akan berputar pada sumbunya",
      "Matahari akan berhenti bersinar pada malam hari",
    ],
    correct: 1,
    explanation:
      "Dengan sumbu tegak, perubahan tahunan sudut penyinaran jauh lebih kecil. Namun lintang dan kondisi iklim tetap memengaruhi penyinaran. Perlu dibedakan antara kemiringan sumbu dan variasi iklim lokal.",
  },
];

export type GameQuestion = {
  id: number;
  angle: number;
  scene: OrbitKey;
  prompt: string;
  options: string[];
  correct: number;
  hint: string;
  explanation: string;
};

export const GAME_QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    angle: 180,
    scene: "juni",
    prompt:
      "Perhatikan posisi Bumi. Kutub Utara condong ke arah Matahari. Musim apa yang umumnya dialami belahan Bumi Utara di wilayah beriklim sedang?",
    options: ["Semi", "Panas", "Gugur", "Dingin"],
    correct: 1,
    hint: "Belahan yang condong ke arah Matahari menerima sinar lebih langsung dan siang lebih panjang.",
    explanation:
      "Pada Solstis Juni, belahan Utara condong ke Matahari. Wilayah beriklim sedang di Utara mengalami musim panas.",
  },
  {
    id: 2,
    angle: 0,
    scene: "desember",
    prompt:
      "Sekarang Bumi berada di sekitar Desember. Musim apa yang dialami belahan Bumi Selatan?",
    options: ["Dingin", "Semi", "Panas", "Gugur"],
    correct: 2,
    hint: "Lihat kutub mana yang miring ke arah Matahari pada posisi ini.",
    explanation:
      "Pada Solstis Desember, belahan Selatan condong ke Matahari. Belahan Selatan mengalami musim panas, sedangkan belahan Utara dingin.",
  },
  {
    id: 3,
    angle: 90,
    scene: "maret",
    prompt:
      "Pada posisi sekitar Maret, ciri yang paling tepat untuk banyak wilayah adalah ...",
    options: [
      "Siang dan malam relatif hampir sama, belahan Utara memasuki semi",
      "Belahan Utara mengalami siang terpanjang",
      "Belahan Selatan mengalami siang terpanjang",
      "Kedua belahan mengalami musim panas bersamaan",
    ],
    correct: 0,
    hint: "Posisi Maret adalah ekuinoks. Ingat arti kata ekuinoks.",
    explanation:
      "Pada ekuinoks Maret, lama siang dan malam relatif hampir sama di banyak wilayah. Belahan Utara memasuki semi dan belahan Selatan memasuki gugur.",
  },
  {
    id: 4,
    angle: 270,
    scene: "september",
    prompt:
      "Mengapa musim di belahan Utara dan Selatan tidak sama pada posisi ini?",
    options: [
      "Karena jarak Bumi ke Matahari berubah sangat besar",
      "Karena satu belahan lebih condong ke Matahari sehingga sudut penyinaran dan lama siangnya berbeda",
      "Karena Matahari mengelilingi Bumi",
      "Karena Bumi berhenti berputar saat ekuinoks",
    ],
    correct: 1,
    hint: "Fokus pada kemiringan sumbu, bukan terutama pada jarak.",
    explanation:
      "Kemiringan sumbu membuat penyinaran tidak simetris. Ketika satu belahan menerima sinar lebih langsung dan siang lebih panjang, belahan lain mengalami kondisi sebaliknya.",
  },
  {
    id: 5,
    angle: 180,
    scene: "juni",
    prompt:
      "Mengapa sinar Matahari yang datang lebih tegak dapat menghangatkan permukaan lebih kuat?",
    options: [
      "Karena Matahari mengirim lebih banyak sinar ke satu belahan",
      "Karena energi yang sama terkonsentrasi pada area yang lebih kecil",
      "Karena Bumi lebih dekat ke Matahari pada musim panas",
      "Karena sinar tegak tidak dapat dipantulkan",
    ],
    correct: 1,
    hint: "Bayangkan cahaya lampu senter yang diarahkan tegak dan miring ke dinding.",
    explanation:
      "Sinar tegak menyebarkan energi yang sama ke area yang lebih kecil. Akibatnya, energi per satuan luas lebih besar dibanding sinar yang datang miring.",
  },
];

export const SCORE_BANDS = [
  { min: 90, title: "Penjelajah Musim Ahli", note: "Luar biasa! Pemahamanmu tentang kemiringan sumbu dan musim sangat kuat." },
  { min: 80, title: "Ilmuwan Muda Hebat", note: "Hebat! Sedikit lagi menuju penguasaan penuh." },
  { min: 70, title: "Penjelajah yang Terus Berkembang", note: "Bagus! Pelajari kembali bagian yang belum kuat, lalu coba lagi." },
  { min: 0, title: "Ayo Jelajahi Lagi", note: "Tidak apa-apa. Kembali ke materi dan laboratorium, lalu coba lagi." },
];
