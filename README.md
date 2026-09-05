# KarmayogiAI - Competency Intelligence Platform

An intelligent, AI-powered competency management, role mapping, gap analysis, and adaptive learning platform designed for organizational capability enhancement.

## 🚀 Key Features

- **Dynamic Role & Competency Mapping**: Intelligent parsing and structuring of behavioral, functional, and domain competencies.
- **AI-Powered Gap Analysis**: Automated discovery of skill deficits with personalized development pathways.
- **Karmayogi AI Companion**: Context-aware assistant powered by Google Gemini for interactive queries, guidance, and career trajectories.
- **Curated Learning Catalogue**: Smart course matching, multi-source training integration, and progress monitoring.
- **Administrative Intelligence Hub**: Real-time organizational analytics, department-wide metrics, and audit logs.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Authentication
- **AI / LLM**: Google GenAI SDK (`@google/genai`) with Gemini models

## 📂 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── controllers/      # API Controllers
│   │   ├── models/           # Mongoose Data Schemas
│   │   ├── routes/           # Express Route Definitions
│   │   ├── scripts/          # Seeding & utility scripts
│   │   └── services/         # AI & Business Logic Services
│   ├── .env.example          # Sample environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # UI & Companion Components
│   │   ├── pages/            # Role-based platform views
│   │   └── services/         # Frontend API clients
│   └── package.json
└── README.md
```

## ⚙️ Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Configure your MONGO_URI and GEMINI_API_KEY
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security
Ensure `.env` files are never pushed to public repositories. Set proper environment variables in your deployment environments.
