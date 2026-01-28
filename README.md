# Dynamic Parenting - Complete Website

## 🚀 Quick Setup

### 1. Upload naar GitHub
Upload alle bestanden naar je nieuwe repository.

### 2. Verbind met Vercel
1. Ga naar vercel.com
2. Import je GitHub repository
3. Vercel detecteert automatisch Next.js

### 3. Environment Variables (Vercel)
Ga naar Project → Settings → Environment Variables en voeg toe:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://snfdwmggohndvkbnmozx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZmR3bWdnb2huZHZrYm5tb3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNjkyMjUsImV4cCI6MjA4NDY0NTIyNX0.4Bb1rtPOeG09uWt8r8I7Gt3h1a8lDWDnMTvFRFVuFFk` |

### 4. Database Setup
Run de SQL in Supabase SQL Editor:
https://supabase.com/dashboard/project/snfdwmggohndvkbnmozx/sql/new

(Gebruik SUPABASE-DATABASE-SETUP.sql)

### 5. Jezelf Therapeut Maken
Na registratie, run in Supabase SQL:
```sql
UPDATE profiles SET role = 'therapist' WHERE email = 'jouw@email.nl';
```

---

## 📁 Structuur

```
app/
├── layout.js          # Root layout + Google Analytics + AdSense
├── page.js            # Homepage
├── globals.css        # Styling
├── sitemap.js         # SEO sitemap
├── robots.js          # SEO robots
├── diensten/          # Diensten pagina
├── over-mij/          # Over mij pagina
├── contact/           # Contact pagina
├── blog/              # Blog overzicht + detail
├── login/             # Inloggen
├── registreren/       # Registreren
├── portaal/           # Patiënt dashboard
└── therapeut/         # Therapeut dashboard

data/
└── blogPosts.js       # Blog content

lib/
└── supabase.js        # Database connectie
```

---

## 🔗 Routes

| Route | Functie |
|-------|---------|
| `/` | Homepage |
| `/diensten` | Diensten overzicht |
| `/over-mij` | Over mij |
| `/blog` | Blog artikelen |
| `/contact` | Contact |
| `/login` | Inloggen |
| `/registreren` | Account maken |
| `/portaal` | Patiënt portaal |
| `/therapeut` | Therapeut portaal |

---

## ✅ Features

- ✅ Google Analytics (G-M7G5KDLS9Y)
- ✅ Google AdSense (ca-pub-4840398444011708)
- ✅ SEO optimized (sitemap, meta tags)
- ✅ Blog met 6 artikelen
- ✅ Patiënt portaal (blauw thema)
- ✅ Therapeut portaal (groen thema)
- ✅ Supabase authenticatie
- ✅ Vragenlijsten systeem
- ✅ Responsive design
