# AI Chat Web — Panduan Deploy ke Vercel

## Struktur File
```
ai-web/
├── index.html       ← Tampilan web chat
├── api/
│   └── chat.js      ← Backend API (serverless)
└── vercel.json      ← Konfigurasi Vercel
```

## Langkah Deploy

### 1. Daftar / Login Vercel
Buka https://vercel.com dan login pakai akun GitHub.

### 2. Upload Project
Ada 2 cara:

**Cara A — Via GitHub (Rekomendasi):**
1. Upload folder `ai-web` ke GitHub repo baru
2. Di Vercel → klik "Add New Project"
3. Import repo dari GitHub
4. Klik "Deploy" — selesai!

**Cara B — Via Vercel CLI:**
```bash
npm install -g vercel
cd ai-web
vercel
```

### 3. Set Environment Variable (WAJIB!)
Setelah deploy, masuk ke:
**Vercel Dashboard → Project → Settings → Environment Variables**

Tambahkan:
| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxxxxxxxxxx` |

> Dapatkan API key di: https://console.anthropic.com

### 4. Redeploy
Setelah set env variable, klik **Redeploy** agar perubahan aktif.

---

## Cara Dapat API Key Anthropic
1. Buka https://console.anthropic.com
2. Daftar / login
3. Klik "API Keys" → "Create Key"
4. Copy key-nya → paste ke Vercel env variable

---

## Fitur Web
- ✅ Chat AI dengan Claude (Anthropic)
- ✅ Mendukung Bahasa Indonesia & Inggris
- ✅ Desain modern & responsive (HP friendly)
- ✅ Riwayat chat dalam satu sesi
- ✅ Tombol hapus chat
- ✅ Suggestion chips untuk memulai
- ✅ Format teks (bold, code, list)
- ✅ Indikator typing animasi
