# ⚡️ ZapShare — Secure One-Time File & Code Sharing App

**ZapShare** is a privacy-focused, minimalistic web app that allows **secure one-time sharing** of files or code snippets using a simple 4-digit code.

🔐 No accounts • 🔄 One-time access • ✨ End-to-End Encryption

### 🌐 Hosted On Netlify  
The project is live and accessible at:  
🔗 [https://your-netlify-site.netlify.app](https://ZapShare.netlify.app)


---

## 📌 Table of Contents

- 🧠 Overview
- 🚀 Features
- 🎥 Project Showcase
- 🧱 Tech Stack
- 📁 Folder Structure
- ⚙️ Setup
- 🌍 Deployment
- 📡 API Reference
- 🔒 How It Works
- 🔮 Roadmap
- 🤝 Contributing
- 📬 Contact
- 📄 License


---

## 🧠 Overview

ZapShare provides fast, private, one-time access to shared files or code snippets. Unlike cloud storage or pastebin tools, it deletes your data after first access, and encrypts everything.

---

## 🚀 Features

✅ One-time access  
✅ Drag-and-drop upload  
✅ AES-256 encryption  
✅ Supabase file CDN  
✅ MongoDB metadata  
✅ Fully responsive  
✅ No login required  

---

## 🎥 Project Showcase

---

## 🧱 Tech Stack

| Layer      | Tech                       |
|------------|----------------------------|
| Frontend   | Next.js 14, Tailwind CSS   |
| Backend    | Node.js API routes         |
| Database   | MongoDB (via Mongoose)     |
| Storage    | Supabase (File Buckets)    |
| Encryption | AES (Node.js crypto)       |
| Deployment | Netlify                    |

---

## 📁 Folder Structure

```bash
zapshare/
├── app/                # API route handlers
├── components/         # UI components
├── lib/                # Supabase, MongoDB, AES helpers
├── public/             # Static assets
├── styles/             # Tailwind + global
├── .env.local          # Environment secrets
├── netlify.toml        # Netlify config
└── README.md


