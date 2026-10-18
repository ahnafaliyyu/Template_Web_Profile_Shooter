import type { Locale } from "./i18n";

const id = {
  // navigasi dan bingkai
  nHome: "Beranda", nAbout: "Tentang", nProjects: "Karya", nSkills: "Skill", nCreds: "Kredensial", nGuest: "Buku tamu", nContact: "Kontak",
  menu: "Menu", dirTitle: "Index Directory", nodeSynced: "Node: synced", latency: "Latency", theme: "Ganti tema", contactAria: "Kontak", langAria: "Ganti bahasa",
  seeAll: "Semua →", noData: "Belum ada data.", loading: "Memuat…",
  // home
  homeOv: "Index_root // Dossier_01", iBuild: "Saya membangun", ctaProjects: "Lihat arsip karya ↗", ctaContact: "Hubungi saya",
  mProjects: "Karya terbit", mTech: "Teknologi", mFields: "Bidang", mPubs: "Publikasi",
  featured: "Karya unggulan", allWorks: "Semua karya →", openDossier: "Buka dosir ↗", sysLog: "Log sistem", arsenal: "Arsenal", allSkills: "Semua skill →",
  logBoot: "boot dossier_root ........ OK", logProfile: "profil dimuat: {0}", logCount: "{0} karya terbit · {1} teknologi",
  logStatus: "status: {0}", logWait: "menunggu pesan", dispatch: "Direct dispatch", sendMsg: "Kirim pesan ↗",
  // about
  aboutOv: "Dossier // Tentang", aboutTitle: "Tentang {0}.", kName: "Nama", kRole: "Peran", kFocus: "Fokus", kLoc: "Lokasi", kEmail: "Email",
  channels: "Kanal", currentFocus: "Fokus saat ini", education: "Pendidikan", timeline: "Jejak", telemetry: "Telemetri", topStack: "Teknologi teratas", reach: "Hubungi ↗",
  // skills
  skillsOv: "Arsenal // Skill", skillsTitle: "Arsenal.", domains: "Kelompok", usedIn: "Muncul di {0} karya", fromWorks: "Teknologi dari karya",
  levelNote: "Tingkat L1–L5 tampil bila diisi di admin.", nTech: "{0} teknologi", nGroups: "{0} kelompok", inWorks: "{0} karya",
  // kredensial
  credsOv: "Arsip // Kredensial", credsTitle: "Kredensial.", registry: "Daftar", viewProof: "Lihat bukti ↗", noCreds: "Belum ada kredensial yang diterbitkan.",
  kPendidikan: "Pendidikan", kSertifikat: "Sertifikat", kPublikasi: "Publikasi", kPenghargaan: "Penghargaan", nRecords: "{0} catatan", byKind: "Per jenis", detail: "Rincian", issuer: "Penerbit", yearL: "Tahun",
  // buku tamu
  guestOv: "Log // Buku tamu", guestTitle: "Buku tamu.", writeMsg: "Tulis pesan", fName: "Nama", fMsg: "Pesan", send: "Kirim pesan", sending: "Mengirim…",
  thanksGuest: "Terima kasih. Pesanmu menunggu persetujuan sebelum tampil.", noMsgs: "Belum ada pesan. Jadilah yang pertama.", modNote: "Setiap pesan dimoderasi sebelum tampil.",
  total: "Total", latest: "Terbaru", nMsgs: "{0} pesan", messages: "Pesan",
  // kontak
  contactOv: "Dispatch // Kontak", contactTitle: "Mari membangun sesuatu yang lebih tajam.", fSubject: "Subjek", fEmail: "Email kamu", sendMail: "Kirim email ↗",
  thanksContact: "Pesan terkirim. Terima kasih, saya akan membalas lewat email.", writeToMe: "Tulis pesan", directChannels: "Kanal langsung", statusL: "Status",
  // karya
  projOv: "2023–2026 // Karya terpilih", archive: "Arsip karya.", list: "Daftar karya", nWorks: "{0} karya", dossier: "Dosir", spec: "Spesifikasi",
  progress: "Progres", info: "Info proyek", type: "Jenis", year: "Tahun", framework: "Kerangka", stack: "Stack", access: "Akses", viewCode: "Lihat kode ↗", privateRepo: "Repo privat",
  back: "← Daftar", prevW: "Karya sebelumnya", nextW: "Karya berikutnya", workOf: "Karya {0} dari {1}", noShot: "Tangkapan layar · belum ada",
  sAktif: "Aktif", sSelesai: "Selesai", sKonsep: "Konsep", aPublik: "Publik", aPrivat: "Privat", classification: "Klasifikasi", serial: "Serial", noProjects: "Belum ada karya yang diterbitkan.",
  archiveStat: "Arsip", latestWork: "Terbaru",
  // galat formulir (kode dari server)
  errName: "Nama wajib diisi.", errShort: "Pesan terlalu pendek.", errLong: "Pesan terlalu panjang.", errEmail: "Alamat email tidak valid.", errSubject: "Subjek wajib diisi.",
  errRate: "Terlalu banyak pesan dari perangkat ini. Coba lagi satu jam lagi.", errDown: "Layanan sedang istirahat. Coba lagi nanti.", errBad: "Isian tidak valid.",
  // 404
  notFound: "Halaman tidak ditemukan.", toHome: "Kembali ke beranda",
};

type Dict = typeof id;

const en: Dict = {
  nHome: "Home", nAbout: "About", nProjects: "Projects", nSkills: "Skills", nCreds: "Credentials", nGuest: "Guestbook", nContact: "Contact",
  menu: "Menu", dirTitle: "Index Directory", nodeSynced: "Node: synced", latency: "Latency", theme: "Toggle theme", contactAria: "Contact", langAria: "Switch language",
  seeAll: "See all →", noData: "No data yet.", loading: "Loading…",
  homeOv: "Index_root // Dossier_01", iBuild: "I build", ctaProjects: "View project archive ↗", ctaContact: "Contact me",
  mProjects: "Published works", mTech: "Technologies", mFields: "Fields", mPubs: "Publications",
  featured: "Featured work", allWorks: "All works →", openDossier: "Open dossier ↗", sysLog: "System log", arsenal: "Arsenal", allSkills: "All skills →",
  logBoot: "boot dossier_root ........ OK", logProfile: "profile loaded: {0}", logCount: "{0} published works · {1} technologies",
  logStatus: "status: {0}", logWait: "awaiting message", dispatch: "Direct dispatch", sendMsg: "Send a message ↗",
  aboutOv: "Dossier // About", aboutTitle: "About {0}.", kName: "Name", kRole: "Role", kFocus: "Focus", kLoc: "Location", kEmail: "Email",
  channels: "Channels", currentFocus: "Current focus", education: "Education", timeline: "Timeline", telemetry: "Telemetry", topStack: "Top stack", reach: "Get in touch ↗",
  skillsOv: "Arsenal // Skills", skillsTitle: "Arsenal.", domains: "Domains", usedIn: "Appears in {0} works", fromWorks: "Technology from works",
  levelNote: "Levels L1–L5 appear when set in the admin.", nTech: "{0} technologies", nGroups: "{0} domains", inWorks: "{0} works",
  credsOv: "Archive // Credentials", credsTitle: "Credentials.", registry: "Registry", viewProof: "View proof ↗", noCreds: "No credentials published yet.",
  kPendidikan: "Education", kSertifikat: "Certificates", kPublikasi: "Publications", kPenghargaan: "Awards", nRecords: "{0} records", byKind: "By type", detail: "Details", issuer: "Issuer", yearL: "Year",
  guestOv: "Log // Guestbook", guestTitle: "Guestbook.", writeMsg: "Write a message", fName: "Name", fMsg: "Message", send: "Send message", sending: "Sending…",
  thanksGuest: "Thank you. Your message is waiting for approval before it appears.", noMsgs: "No messages yet. Be the first.", modNote: "Every message is moderated before it appears.",
  total: "Total", latest: "Latest", nMsgs: "{0} messages", messages: "Messages",
  contactOv: "Dispatch // Contact", contactTitle: "Let’s build something sharper.", fSubject: "Subject", fEmail: "Your email", sendMail: "Send email ↗",
  thanksContact: "Message sent. Thank you, I will reply by email.", writeToMe: "Write to me", directChannels: "Direct channels", statusL: "Status",
  projOv: "2023–2026 // Selected works", archive: "Project archive.", list: "Project list", nWorks: "{0} works", dossier: "Dossier", spec: "Specifications",
  progress: "Progress", info: "Project info", type: "Type", year: "Year", framework: "Framework", stack: "Stack", access: "Access", viewCode: "View code ↗", privateRepo: "Private repo",
  back: "← List", prevW: "Previous work", nextW: "Next work", workOf: "Work {0} of {1}", noShot: "Screenshot · none yet",
  sAktif: "Active", sSelesai: "Done", sKonsep: "Concept", aPublik: "Public", aPrivat: "Private", classification: "Classification", serial: "Serial", noProjects: "No works published yet.",
  archiveStat: "Archive", latestWork: "Latest",
  errName: "Name is required.", errShort: "Message is too short.", errLong: "Message is too long.", errEmail: "Invalid email address.", errSubject: "Subject is required.",
  errRate: "Too many messages from this device. Try again in an hour.", errDown: "The service is resting. Please try again later.", errBad: "Invalid input.",
  notFound: "Page not found.", toHome: "Back to home",
};

export type { Dict };
export const dict: Record<Locale, Dict> = { id, en };
export const getDict = (l: Locale) => dict[l];

export type StrKey = { [K in keyof Dict]: Dict[K] extends string ? K : never }[keyof Dict];
const ERR = { name: "errName", short: "errShort", long: "errLong", rate: "errRate", down: "errDown", bad: "errBad", email: "errEmail", subject: "errSubject" } as const;
export const errMsg = (d: Dict, code?: keyof typeof ERR) => (code ? d[ERR[code]] : "");
