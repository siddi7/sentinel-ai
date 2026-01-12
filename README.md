# 🛡️ Sentinel.ai  
## Real-Time Acoustic Fraud Detection & Forensic Intelligence Platform

## 📌 Overview

**Sentinel.ai** is a real-time, AI-powered acoustic security system designed to detect, analyze, and explain social engineering and fraud attempts during live or recorded voice interactions.

Unlike traditional call blockers or keyword filters, Sentinel.ai performs **context-aware forensic analysis** on speech — identifying psychological manipulation, financial coercion, urgency tactics, and authority abuse **as the conversation unfolds**.

The platform is built with **enterprise scalability, low-latency inference, and privacy-by-design** principles.

---

## 🎯 Core Capabilities

### 🔍 Contextual Fraud Detection
- Detects scam patterns beyond phone numbers and static rules
- Analyzes *intent*, *urgency*, *authority framing*, and *payment pressure*

### ⚡ Real-Time Intelligence
- Sub-second speech-to-text transcription
- Streaming analysis for live calls
- Immediate risk scoring (0–100)

### 🧠 Forensic Highlighting (Key Innovation)
- Highlights **exact phrases** responsible for elevated risk
- Educates users *why* a conversation is dangerous
- Provides audit-ready forensic artifacts

### 🎧 Acoustic & Linguistic Fusion
- Combines speech signals with LLM-based semantic reasoning
- Visual waveform synchronized with transcript segments


## 🧱 High-Level Architecture

```

┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│ Audio Input │ ──▶ │  FastAPI API │ ──▶ │ Groq Inference │
│ (Live/File) │     │ (Streaming)  │     │  (Whisper +   │
└─────────────┘     └──────────────┘     │   Llama 3.3)  │
        |                                       │
        ▼                                       ▼
┌─────────────┐                         ┌────────────────┐
│ Waveform UI │ ◀────────────────────── │ Risk Engine & │
│ (React)     │                         │ Forensics     │
└─────────────┘                         └────────────────┘

````

---

## 🧠 Intelligence Stack

### **Speech Recognition**
- **Model:** `Whisper-large-v3-turbo`
- **Provider:** Groq Cloud
- **Latency:** Sub-second transcription for real-time use

### **Fraud Reasoning Engine**
- **Model:** `Llama-3.3-70B`
- **Technique:** Zero-shot forensic classification with constrained system prompts
- **Output:** Structured risk signals + explanation spans

### **Risk Scoring**
Weighted multi-factor scoring based on:
- Urgency escalation
- Authority impersonation
- Financial demand patterns
- Emotional manipulation indicators

---

## 🖥️ Frontend Stack

- **React 18 + Vite** — High-performance SPA
- **Tailwind CSS v4** — Enterprise-grade design system
- **Framer Motion** — Alert states & risk transitions
- **Wavesurfer.js** — Real-time audio waveform visualization

---

## ⚙️ Installation & Local Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/siddi7/sentinel-ai.git
cd sentinel-ai
````

---

### 2️⃣ Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv

# Activate environment
# Windows (PowerShell)
.\venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
echo GROQ_API_KEY=your_api_key_here > .env

# Run development server
uvicorn main:app --reload
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 End-to-End Workflow

1. **Ingestion**

   * User uploads an audio file or enables live microphone capture

2. **Streaming Processing**

   * Audio chunks streamed to FastAPI backend
   * Forwarded to Groq for low-latency inference

3. **Forensic Classification**

   * LLM identifies fraud markers and psychological triggers

4. **Visualization & Reporting**

   * Risk score dashboard
   * Highlighted transcript
   * Synchronized waveform playback

---

## 🛡️ Security & Privacy Model

* **Ephemeral Processing**

  * Audio is processed in-memory only
  * No long-term storage by default

* **No Training on User Data**

  * Audio and transcripts are never used for model retraining

* **Configurable Threat Profiles**

  * Tunable sensitivity for:

    * Elderly protection
    * Corporate security
    * Financial institutions
    * Call-center compliance

---

## 🏭 Use Cases

* Scam & fraud prevention for individuals
* Elderly safety monitoring
* Financial institution call auditing
* Corporate social engineering defense
* Digital forensics & investigations

---

## 🧩 Roadmap (Planned)

* Multi-language fraud detection
* On-device inference fallback
* Enterprise RBAC & audit logs
* SIEM / SOC integrations
* Mobile SDK (Android & iOS)

---


