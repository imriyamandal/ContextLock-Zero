# ContextLock Zero: AI Decision Immune System

<div align="center">

```
   ____            _            _   _                 _      _____               
  / ___|___  _ __ | |_ _____  _| |_| |    ___   ___  | | __ |__  /___ _ __ ___   
 | |   / _ \| '_ \| __/ _ \ \/ / __| |   / _ \ / __| | |/ /   / // _ \ '__/ _ \  
 | |__| (_) | | | | ||  __/>  <| |_| |__| (_) | (__  |   <   / /|  __/ | | (_) | 
  \____\___/|_| |_|\__\___/_/\_\\__|_____\___/ \___| |_|\_\ /____\___|_|  \___/  
```

### *"Git tracks code. ContextLock Zero protects project decisions."*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-12.3-purple?style=for-the-badge&logo=react)](https://reactflow.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-Google_AI-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-FF6F00?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![SQLite](https://img.shields.io/badge/SQLite-ACID_Store-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

</div>

---

## 🌟 Executive Overview & Product Vision

Modern software engineering teams scatter critical architecture decisions across PRDs, meeting minutes, Slack threads, Figma comments, and git commit logs. Existing tools preserve raw text, but they fail to detect contradictions or explain decision history with evidence. 

**ContextLock Zero** is an **AI Decision Immune System**. It continuously ingests project specifications, detects hidden cross-document contradictions, explains decision history with verified evidence citations, simulates downstream dependency blast radius, and alerts teams before costly architectural mistakes reach production.

---

## 🏗️ Multi-Agent Architecture (LangGraph Flow)

```
                            ┌────────────────────────────────────────┐
                            │    Uploaded Artifacts (PDF, MD, Git)   │
                            └───────────────────┬────────────────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │    Extractor Agent    │ ◄── Gemini 2.5 Flash
                                    └───────────┬───────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │ Decision Graph Engine │
                                    └───────────┬───────────┘
                       ┌────────────────────────┼────────────────────────┐
                       │                        │                        │
            ┌──────────▼──────────┐  ┌──────────▼──────────┐  ┌──────────▼──────────┐
            │Conflict Radar Engine│  │Dependency Blaster   │  │Ownership Gap Engine │
            └──────────┬──────────┘  └──────────┬──────────┘  └──────────┬──────────┘
                       │                        │                        │
                       └────────────────────────┼────────────────────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │Stability & Health Core│
                                    └───────────┬───────────┘
                                                │
           ┌────────────────────────────────────┼────────────────────────────────────┐
           │                                    │                                    │
┌──────────▼──────────┐              ┌──────────▼──────────┐              ┌──────────▼──────────┐
│Decision Immune Ctr  │              │ Interactive Graph + │              │ Grounded Chat +     │
│& Explainable Health │              │ Replay + Simulator  │              │ Decision Passport   │
└─────────────────────┘              └─────────────────────┘              └─────────────────────┘
```

### Agent Responsibilities:
1. **Extractor Agent**: Ingests multi-format artifacts and extracts structured decisions, rationales, alternatives, and exact citation quotes.
2. **Decision Graph Builder**: Models decisions into a typed graph with relations (`caused`, `discussed`, `replaced`, `approved`, `depends_on`).
3. **Conflict Radar Agent**: Cross-triangulates documents (PRD vs Meeting vs Git Commits) to detect discrepancies with grounded citations.
4. **Ownership Gap Agent**: Flags unassigned architectural components lacking a verified DRI/owner.
5. **Stability Analyzer Agent**: Analyzes historical decision churn and detects flip-flops (e.g., JWT → OAuth → Firebase → JWT).
6. **Evidence Agent**: Grounds all AI responses strictly on verified source documents with paragraph numbers and confidence scores.
7. **Chat Reasoning Engine**: Conversational assistant strictly constrained: *"Only explain what uploaded evidence supports. Never invent reasons."*

---

## ⚡ Version 2.0: Single-Pane AI Decision Command Center

ContextLock Zero Version 2.0 replaces traditional multi-page navigation with an **immersive 3-panel command center**:

| Panel / Component | Description | Judge Highlight |
|---|---|---|
| **📁 Left: Ingestion & Files** | Universal drag & drop dropzone for PDF, Markdown, TXT, JSON, Git logs + live extraction progress bar. | Real parsing on arbitrary files + 1-click demo loader (`<1s`). |
| **🕸️ Center: Living Decision Graph** | React Flow canvas with custom typed nodes, glowing animated edges, and pulsing conflict auras. | Clicking any node calculates downstream blast radius in real-time. |
| **⏳ Center Bottom: Decision Replay** | Interactive milestone scrubber at the bottom of the graph. | Replays project decisions chronologically with auto-play animation. |
| **🚨 Right: Conflict Radar** | Cross-triangulates PRD (JWT) vs Meeting (OAuth 2.0) vs Git Commits (Firebase). | Discrepancy diff cards with 1-click resolution and confetti. |
| **🛡️ Right: Health Scorecard & DRIs** | SVG Radial Health Gauge with 5 explainable dimension scores and "Why" context. | Identifies unowned subsystems (e.g. *Multi-Channel Notifications*). |
| **💬 Right: Grounded AI Chat** | Conversational assistant strictly grounded on uploaded documents. | Clickable citation pills, paragraph numbers, and confidence metrics. |
| **📑 Slide-Over: Decision Passport** | Slide-over drawer generating executive audit report matching Page 11 spec. | 1-Click PDF export via ReportLab. |
| **🔴 Live Mode Injector** | Real-time architecture update simulator. | Ingests live meeting decisions without page reload. |

---

## 🎬 60-Second Hackathon Demo Script

- **00–10s**: Click **⚡ Load Demo Project** on top header (or upload files). Instant toast confirms ingestion in <1s.
- **10–20s**: Open **Decision Graph**. The interactive React Flow graph renders with colored nodes and animated dependency lines.
- **20–30s**: Switch to **Conflict Radar**. The **Critical Contradiction Alert** flashes: *"3-Way Authentication Dispute: PRD (JWT) vs Meeting (OAuth 2.0) vs Git Commit (Firebase Auth)"*.
- **30–40s**: Click the **JWT Node** on the graph. The **Impact Blast Radius** drawer lights up showing direct impact on *API Gateway (Envoy)*, *Mobile Client*, and *Offline Verification Engine*.
- **40–50s**: Drag the **Decision Replay slider** at the bottom of the screen. Watch milestones spawn chronologically: Sept 10 (JWT) → Sept 12 (OAuth) → Sept 13 (Firebase).
- **50–60s**: Open **Decision Passport** and click **Download Official PDF**. The executive-ready report downloads immediately.

> **End with:** *"Before teams write the wrong code, ContextLock Zero protects the decision."*

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 18/19, Tailwind CSS, `@xyflow/react` (React Flow), Lucide React, Canvas Confetti.
- **Backend**: FastAPI, LangGraph Multi-Agent Engine, Gemini 2.5 Flash / Google GenAI SDK, SQLite, ReportLab.
- **Parsers**: `pypdf`, Markdown, JSON, Git Commit history parsers.
- **Design System**: Linear / Raycast / Vercel dark theme (`#0A0F1C`, `#111827`, `#7C3AED`, `#22D3EE`, `#EF4444`, `#10B981`).

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
The FastAPI backend will be live at `http://127.0.0.1:8000` (Swagger docs at `/docs`).

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Run Automated Tests
```bash
pytest backend/test_backend.py -v
```

---

## 🔮 Future Scope & Integrations (Roadmap)
- **Slack & Microsoft Teams Bot**: Real-time decision capture and contradiction alerts directly in channels.
- **Jira & Linear Sync**: Automatic issue tagging when decisions drift or reverse.
- **GitHub Webhook Action**: Blocks PR merges that contradict approved PRD specifications.
- **Figma Design Plugin**: Syncs UI component requirements with backend architecture locks.

---

<div align="center">
<b>ContextLock Zero</b> · Built for Next-Gen Engineering Teams
</div>
