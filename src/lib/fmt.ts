/** Isi templat teks kamus: f("{0} karya", 5) → "5 karya". Teks biasa agar aman dikirim ke komponen klien. */
export const f = (tpl: string, ...v: (string | number)[]) => tpl.replace(/\{(\d)\}/g, (_, i) => String(v[+i]));
