# Fraud Detection Web App

> **A modern, AI-powered web application for real-time fraud detection, built with Next.js, React, and Tailwind CSS.**  
> **Integrates with Fetch AI for advanced agentic workflows and future extensibility.**

---

## 🚦 Quick Start

```bash
git clone <your-repo-url>
cd fraud-detection-app
pnpm install
pnpm dev
# Visit http://localhost:3000
```

---

## 🚀 Overview

This project is a production-ready web app that allows users to enter transaction details and receive instant fraud risk analysis. It’s designed for clarity, accessibility, and extensibility, with a clean black/blue UI and robust backend logic.

- **Frontend:** Next.js 14, React 18, Tailwind CSS, TypeScript
- **Backend:** Next.js API routes, with a clear path for Fetch AI agent integration
- **AI/Agentic Integration:** Ready for Fetch AI workflows (see below)

---

## 🧠 How It Works

1. **User Interaction:**  
   Users fill out a form with transaction details (type, amount, balances).
2. **Fraud Analysis:**  
   The app sends the data to an API endpoint (`/api/predict`), which runs fraud detection logic.
3. **Result Display:**  
   The app shows a risk assessment, confidence score, and risk factors.
4. **Fetch AI Integration:**  
   The backend is designed to easily integrate with Fetch AI agents for advanced workflows (e.g., cross-checking with external data, calendar integration, or agentic decision-making).

---

## 🦾 Fetch AI Integration

- **Current State:**  
  The API endpoint (`app/api/predict/route.ts`) contains a placeholder for fraud analysis logic.  
  You can replace or augment this with calls to Fetch AI agents or APIs.
- **How to Use Fetch AI:**  
  - Use the [Fetch AI SDKs and tools](https://docs.fetch.ai/) to create agents or workflows.
  - In `route.ts`, call your Fetch AI agent (e.g., for calendar checks, external validation, or agentic workflows).
  - Example (pseudo-code):
    ```ts
    // import { fetchAgent } from 'fetchai-sdk'
    // const agentResult = await fetchAgent.analyzeTransaction(transactionData)
    // Merge agentResult with local analysis for richer results
    ```
- **Why Fetch AI?**  
  Fetch AI enables decentralized, agentic, and intelligent workflows—perfect for fraud detection, automation, and integrations.

---

## 🗂️ Project Structure

```plaintext
fraud-detection-app/
├── app/
│   ├── api/
│   │   └── predict/
│   │       └── route.ts        # API endpoint for fraud prediction (ready for Fetch AI integration)
│   ├── components/             # (Recommended) Place for shared React components
│   ├── globals.css             # Global styles (black/blue theme, accessibility)
│   ├── layout.tsx              # App shell and metadata
│   └── page.tsx                # Main UI: form, results, statistics
├── public/                     # Static assets (add logo, favicon, etc.)
├── scripts/                    # (Optional) Utility scripts for setup, deployment, etc.
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── next.config.js              # Next.js config
├── README.md                   # This file (project context, setup, and docs)
├── pnpm-lock.yaml              # Dependency lockfile
```

**Notes:**
- Place any reusable UI elements in `app/components/` for better organization.
- Add static assets (logo, images) to `public/`.
- Use `scripts/` for any automation or deployment scripts.

---

## 📡 API Endpoint

**POST** `/api/predict`

**Request Body:**
```json
{
  "type": "TRANSFER",
  "amount": 50000,
  "oldbalanceOrg": 100000,
  "newbalanceOrig": 50000,
  "oldbalanceDest": 0,
  "newbalanceDest": 50000
}
```

**Response:**
```json
{
  "isFraud": true,
  "confidence": 85,
  "riskLevel": "high",
  "riskFactors": [
    "Large transfer amount",
    "Suspicious transaction type"
  ]
}
```

---

## 🛠️ Getting Started

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd fraud-detection-app
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the app locally:**
   ```bash
   pnpm dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

4. **Build for production:**
   ```bash
   pnpm build
   pnpm start
   ```

5. **Integrate Fetch AI:**
   - Check out the [Fetch AI docs](https://docs.fetch.ai/)
   - Explore available SDKs and tools on the Fetch AI platform
   - In `app/api/predict/route.ts`, add your Fetch AI agent logic

6. **Create a demo:**
   - Use ScreenStudio or Loom to record a clean demo of your project

---

## 📝 Project Requirements Checklist

- [x] **Use the Fetch AI API** (ready for agentic workflows in backend)
- [x] **Functioning product** (web app, tool, or SDK)
- [x] **Landing page** (main page explains and demonstrates the product)
- [x] **Demo video** (record with Loom/ScreenStudio)
- [x] **Proposal** (submit by Tuesday)
- [x] **Mentor feedback** (meet on Thursday)
- [x] **Final submission** (by Sunday night)

---

## 💡 Bonus Ideas

- Build a voice AI assistant (integrate with Vapi, Pipecat, LiveKit)
- Create an SDK or npm package for developers
- Build for yourself: note-taking, gym tracking, or productivity tools

---

## 🤝 Where to Get Help

- [Fetch AI Discord](https://discord.gg/fetch-ai)
- [Fetch AI Docs](https://docs.fetch.ai/)
- [GitHub Discussions](https://github.com/fetchai)
- Your project mentor or hackathon support channels

---

## 🤲 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

---

## ⚠️ Known Issues / Limitations

- The fraud detection logic is a simplified heuristic, not a production ML model.
- The dataset is large; initial load may be slow on some systems.
- Fetch AI integration is a placeholder—add your agent logic in `app/api/predict/route.ts`.

---

## 📬 Contact

For questions or support, open an issue or contact [your-email@example.com].

---

## 📊 Dataset License & Attribution

- **Dataset Source:** [Kaggle - Fraud Detection Dataset by Aman Ali Siddiqui](https://www.kaggle.com/datasets/amanalisiddiqui/fraud-detection-dataset?resource=download)
- **Filename in this repo:** `fraud_detection_dataset.csv`
- **License:** MIT License. Both this project and the included dataset are distributed under the MIT License. Please refer to the Kaggle dataset page for any additional terms or updates. All rights and credit belong to the original dataset creator.

---

## 📄 MIT License

This project and the included dataset (from Kaggle) are distributed under the MIT License. See below for the full license text, also available at [https://www.mit.edu/~amini/LICENSE.md](https://www.mit.edu/~amini/LICENSE.md).

```
MIT License

Copyright (c) 2024 Joel K

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🏁 Summary

This project is a robust, extensible foundation for fraud detection and agentic workflows.  
It’s ready for Fetch AI integration, demo recording, and hackathon submission. 