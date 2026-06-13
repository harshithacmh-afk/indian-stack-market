# FinTrack AI - Indian Stock Chatbot

A real-time financial assistant for Indian stocks with interactive charts and AI-powered insights.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/)

## Setup Instructions for VS Code

1. **Open the project folder in VS Code.**

2. **Install Dependencies:**
   Open a terminal in VS Code (Terminal > New Terminal) and run:
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to a new file named `.env`.
   - Add your [Gemini API Key](https://aistudio.google.com/app/apikey) to `.env`:
     ```env
     GEMINI_API_KEY="your_actual_api_key_here"
     ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```

5. **Access the App:**
   Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- `server.ts`: Express server with API routes and Vite middleware.
- `src/App.tsx`: Main dashboard component.
- `src/services/`: API and AI service integrations.
- `src/components/`: Reusable React components (Charts, Chat, Cards).
- `vite.config.ts`: Vite configuration.

## Troubleshooting

- **API Key Error:** Ensure `GEMINI_API_KEY` is correctly set in `.env` and restart the server (`npm run dev`) after changes.
- **Port Conflict:** If port 3000 is in use, set `PORT=<another_port>` in `.env`.
- **Stock data not loading:** Yahoo Finance symbols for Indian stocks use the `.NS` (NSE) or `.BO` (BSE) suffix, e.g. `RELIANCE.NS`, `TCS.NS`.
