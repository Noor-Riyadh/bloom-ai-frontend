# LearnSmart AI (Bloom)

**AI-powered personalized learning platform** — helping teachers understand every learner, detect hidden knowledge gaps, and generate tailored, AI-driven learning plans for students, in English and Arabic.

Built for the **GenAI for Education Hackathon & Startup Competition 2026**.

---

## 🏆 About the Competition

This project was built as part of the **GenAI for Education Hackathon & Startup Competition 2026**, organized by **Egypt University of Informatics (EUI)** under the auspices of the **Ministry of Communications and Information Technology**, and proudly supported by:

- **Platinum Sponsor:** [WE innovate](https://www.linkedin.com/company/weinnoteme/)
- **Gold Sponsor:** [Intel](https://www.linkedin.com/company/intel-corporation/)
- **Technical Partners:** [EdVentures](https://www.linkedin.com/company/edventuress/) and Kehilan

---

## 🎥 Demo & Live Links

| Resource | Link |
|---|---|
| **Demo Video / Walkthrough** | [Google Drive Folder](https://drive.google.com/drive/folders/1Sg1GeMmECC_FjaHhkeLsLeI2KYA-ZV5A?usp=drive_link) |
| **Live App (Frontend)** | [bloom-ai-frontend.vercel.app](https://bloom-ai-frontend.vercel.app) |
| **Live API (Backend)** | [learnsmart-api.onrender.com](https://learnsmart-api.onrender.com) |
| **Frontend Repository** | [github.com/Noor-Riyadh/bloom-ai-frontend](https://github.com/Noor-Riyadh/bloom-ai-frontend) |
| **Backend Repository** | [github.com/R41847/learnSmart](https://github.com/R41847/learnSmart) |

> ⚠️ The backend runs on a free hosting tier and may take up to ~50 seconds to "wake up" after inactivity. If the live app seems slow to log in, visiting `/health` on the API link above first will speed things up.

---

## 💡 The Problem

Classrooms contain students spanning many different skill levels at once. Overall grades hide *specific* knowledge gaps until it's too late, and manual, paper-based tracking consumes hours of a teacher's time without offering any actionable insight.

**LearnSmart AI** turns raw student data into actionable, individualized learning support — for teachers, students, parents, and school administrators alike.

---

## ✨ Key Features

- **🤖 AI Tutor / Learning Plans** — Generates a personalized learning plan per student using a Machine Learning + RAG (Retrieval-Augmented Generation) + Google Gemini pipeline, based on the student's real academic history.
- **📝 Automatic Assignment Grading** — Teachers create assignments with model answers; students submit free-text responses and receive instant AI-graded scores with detailed, per-question feedback — no multiple-choice required.
- **📊 Performance Trend Tracking** — Tracks whether a student's performance is improving, declining, or stable over time, and feeds that trend into the AI-generated plan.
- **🌐 Arabic Language Support** — Learning plans can be generated in Arabic as well as English, with right-to-left (RTL) aware rendering.
- **♿ Accessibility** — High-contrast display mode and a "Read Aloud" text-to-speech option for AI-generated feedback and plans.
- **👥 Role-Based Dashboards** — Dedicated views for **Teachers**, **Students**, **Parents**, and **School Admins**, each showing only the data relevant to them, backed by real authentication (hashed passwords, not a demo login).

---

## 🧱 Tech Stack

**Frontend** ([`bloom-ai-frontend`](https://github.com/Noor-Riyadh/bloom-ai-frontend))
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Deployed on Vercel

**Backend** ([`learnSmart`](https://github.com/R41847/learnSmart))
- Python + FastAPI (REST API)
- SQLite (relational data: users, students, teachers, parents, assignments)
- ChromaDB + `sentence-transformers` (RAG resource retrieval)
- scikit-learn / `joblib` (student performance classification model)
- Google Gemini API (`google-genai`) — learning plan generation & AI grading
- Deployed on Render

An earlier Streamlit prototype of the same backend logic is also included in the backend repository (`learnsmart_app.py`).

---

## 🚀 Running Locally

### Backend
```bash
cd learnSmart
pip install -r requirements.txt
# set your own Gemini API key
export GEMINI_API_KEY="your_key_here"        # (Windows PowerShell: $env:GEMINI_API_KEY="your_key_here")
python migrate_data.py                        # first-time setup: loads student data
uvicorn api:app --reload --port 8000
```

### Frontend
```bash
cd bloom-ai-frontend
npm install
# create a .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 👥 Team

| Name | Role |
|---|---|
| Noor Riyadh | Full-Stack Developer |
| Salma Abd El Hady | UI/UX Designer |
| Rawan Islam Ahmed Elsayeed | AI & Machine Learning |
| Abdullah Mohamed Fathy Azb | Business Strategy |
| Rofida Nasr Abd Elaleem | Software Developer |

---

## 📌 Project Status

This is a hackathon MVP built end-to-end (data pipeline, ML model, RAG + generative AI, REST API, and a full role-based web frontend) within a very short timeframe. Known limitations and next steps are documented in the pitch deck, including plans for a real many-to-many teacher/student/subject relationship model and expanded Arabic content localization.
