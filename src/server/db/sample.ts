import type { ProjectRecord } from "../modules/projects/types";

/**
 * Data cadangan dan bahan seed. Isi contoh: status dan progres hanya ilustrasi,
 * ganti lewat database (nanti lewat admin) sebelum situs tayang.
 */
export const sampleProjects: ProjectRecord[] = [
  {
    slug: "irigasi-cerdas-esp32", year: 2026, kind: "IoT", status: "aktif", access: "publik", progress: 80,
    framework: "ESP32 + sensor tanah", stack: ["ESP32", "Sensor", "C++", "MQTT"],
    title: { id: "Irigasi Cerdas Berbasis ESP32" },
    summary: { id: "Sistem penyiraman otomatis untuk lahan desa yang membaca kelembapan tanah dan menyalakan pompa saat dibutuhkan." },
    note: { id: "Dilengkapi evaluasi keberlanjutan sistem setelah dipakai di lapangan." },
  },
  {
    slug: "mutu-susu-segar-tinyml", year: 2026, kind: "TinyML", status: "aktif", access: "privat", progress: 60,
    framework: "ESP32-S3 + TinyML", stack: ["TinyML", "ESP32-S3", "Python", "FastAPI"],
    title: { id: "Penjamin Mutu Susu Segar" },
    summary: { id: "Prediksi mutu susu langsung di perangkat kecil, sehingga pos penampungan tidak bergantung pada koneksi internet." },
    note: { id: "Model dilatih di Python lalu dikecilkan agar muat di mikrokontroler." },
  },
  {
    slug: "klasifikasi-sampah-daur-ulang", year: 2026, kind: "Deep learning", status: "selesai", access: "publik", progress: 100,
    framework: "Model CNN ringan", stack: ["Python", "TensorFlow", "CNN"],
    title: { id: "Klasifikasi Sampah Daur Ulang" },
    summary: { id: "Model deep learning ringan yang mengenali jenis material sampah daur ulang dari gambar." },
    note: { id: "Hasilnya dipresentasikan di konferensi." },
  },
  {
    slug: "aspek-sentimen-berita", year: 2026, kind: "NLP", status: "aktif", access: "privat", progress: 55,
    framework: "IndoBERT", stack: ["IndoBERT", "PyTorch", "Colab"],
    title: { id: "Aspek dan Sentimen Berita" },
    summary: { id: "Klasifikasi aspek dan sentimen pada berita dengan IndoBERT, hasilnya dialirkan ke sistem pendukung keputusan." },
    note: { id: "Data dianotasi manual sebelum fine-tuning." },
  },
  {
    slug: "smart-home-power-meter", year: 2026, kind: "AIoT", status: "konsep", access: "privat", progress: 35,
    framework: "ESP32 + FastAPI", stack: ["ESP32", "FastAPI", "TinyML"],
    title: { id: "Smart Home Power Meter" },
    summary: { id: "Pemantau listrik rumah dengan prediksi TinyML dan rekomendasi hemat energi lewat antarmuka web." },
    note: { id: "Modul rekomendasi masih tahap perancangan." },
  },
];
