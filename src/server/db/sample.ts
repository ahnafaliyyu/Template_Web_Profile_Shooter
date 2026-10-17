import type { L, ProfileExtra } from "./schema";
import type { ProjectRecord } from "../modules/projects/types";

/**
 * Data cadangan dan bahan seed. Isi contoh: status dan progres hanya ilustrasi,
 * ganti lewat database (nanti lewat admin) sebelum situs tayang.
 */
export const sampleProjects: ProjectRecord[] = [
  {
    slug: "irigasi-cerdas-esp32", featured: true, year: 2026, kind: "IoT", status: "aktif", access: "publik", progress: 80,
    framework: "ESP32 + sensor tanah", stack: ["ESP32", "Sensor", "C++", "MQTT"],
    title: { id: "Irigasi Cerdas Berbasis ESP32" },
    summary: { id: "Sistem penyiraman otomatis untuk lahan desa yang membaca kelembapan tanah dan menyalakan pompa saat dibutuhkan." },
    note: { id: "Dilengkapi evaluasi keberlanjutan sistem setelah dipakai di lapangan." },
  },
  {
    slug: "mutu-susu-segar-tinyml", featured: true, year: 2026, kind: "TinyML", status: "aktif", access: "privat", progress: 60,
    framework: "ESP32-S3 + TinyML", stack: ["TinyML", "ESP32-S3", "Python", "FastAPI"],
    title: { id: "Penjamin Mutu Susu Segar" },
    summary: { id: "Prediksi mutu susu langsung di perangkat kecil, sehingga pos penampungan tidak bergantung pada koneksi internet." },
    note: { id: "Model dilatih di Python lalu dikecilkan agar muat di mikrokontroler." },
  },
  {
    slug: "klasifikasi-sampah-daur-ulang", featured: true, year: 2026, kind: "Deep learning", status: "selesai", access: "publik", progress: 100,
    framework: "Model CNN ringan", stack: ["Python", "TensorFlow", "CNN"],
    title: { id: "Klasifikasi Sampah Daur Ulang" },
    summary: { id: "Model deep learning ringan yang mengenali jenis material sampah daur ulang dari gambar." },
    note: { id: "Hasilnya dipresentasikan di konferensi." },
  },
  {
    slug: "aspek-sentimen-berita", featured: false, year: 2026, kind: "NLP", status: "aktif", access: "privat", progress: 55,
    framework: "IndoBERT", stack: ["IndoBERT", "PyTorch", "Colab"],
    title: { id: "Aspek dan Sentimen Berita" },
    summary: { id: "Klasifikasi aspek dan sentimen pada berita dengan IndoBERT, hasilnya dialirkan ke sistem pendukung keputusan." },
    note: { id: "Data dianotasi manual sebelum fine-tuning." },
  },
  {
    slug: "smart-home-power-meter", featured: false, year: 2026, kind: "AIoT", status: "konsep", access: "privat", progress: 35,
    framework: "ESP32 + FastAPI", stack: ["ESP32", "FastAPI", "TinyML"],
    title: { id: "Smart Home Power Meter" },
    summary: { id: "Pemantau listrik rumah dengan prediksi TinyML dan rekomendasi hemat energi lewat antarmuka web." },
    note: { id: "Modul rekomendasi masih tahap perancangan." },
  },
];

export const sampleProfile: { name: string; role: L; bio: L; availability: L; focus: L; extra: ProfileExtra } = {
  name: "Ahnaf",
  role: { id: "Mahasiswa Informatika" },
  bio: {
    id: "Saya mahasiswa Informatika yang suka membangun hal yang benar-benar dipakai: perangkat di lapangan, model yang berjalan di perangkat kecil, dan alat bantu data. Ganti paragraf ini lewat admin.",
  },
  availability: { id: "Terbuka untuk proyek dan kolaborasi" },
  focus: { id: "IoT, TinyML, dan data science" },
  extra: {
    email: "hello@example.com",
    location: "Indonesia",
    tags: ["sistem IoT", "model TinyML", "alat bantu data"],
    links: [
      { label: "GitHub", url: "https://github.com/" },
      { label: "LinkedIn", url: "https://linkedin.com/" },
    ],
  },
};

export const sampleSkills = [
  { name: "ESP32", group: "IoT dan embedded", level: null, featured: true },
  { name: "TinyML", group: "IoT dan embedded", level: null, featured: true },
  { name: "C++", group: "IoT dan embedded", level: null, featured: false },
  { name: "Python", group: "Machine learning dan data", level: null, featured: true },
  { name: "TensorFlow", group: "Machine learning dan data", level: null, featured: true },
  { name: "PyTorch", group: "Machine learning dan data", level: null, featured: false },
  { name: "Next.js", group: "Web dan backend", level: null, featured: true },
  { name: "TypeScript", group: "Web dan backend", level: null, featured: true },
  { name: "FastAPI", group: "Web dan backend", level: null, featured: true },
  { name: "PostgreSQL", group: "Web dan backend", level: null, featured: false },
];

export const sampleCredentials: { kind: "pendidikan" | "sertifikat" | "publikasi" | "penghargaan"; title: L; issuer: string | null; year: number | null; url: string | null }[] = [
  { kind: "pendidikan", title: { id: "S1 Informatika" }, issuer: "Universitas Mulawarman", year: null, url: null },
  { kind: "publikasi", title: { id: "Lightweight Deep Learning Models for Classifying Recyclable Waste Materials" }, issuer: "ICITRI 2026", year: 2026, url: null },
];
