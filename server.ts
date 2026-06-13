import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import YahooFinance from "yahoo-finance2";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const yahooFinance = new (YahooFinance as any)();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      const contents = [
        ...(history || []),
        { role: "user", parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  app.get("/api/stock/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const quote = await yahooFinance.quote(symbol);
      res.json(quote);
    } catch (error) {
      console.error(`Error fetching quote for ${req.params.symbol}:`, error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  app.get("/api/stock/:symbol/history", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { period1, period2, interval } = req.query;

      // Default to last 30 days if not provided
      const p2 = period2 ? new Date(period2 as string) : new Date();
      const p1 = period1
        ? new Date(period1 as string)
        : new Date(p2.getTime() - 30 * 24 * 60 * 60 * 1000);

      const history = await yahooFinance.historical(symbol, {
        period1: p1,
        period2: p2,
        interval: (interval as any) || "1d",
      });
      res.json(history);
    } catch (error) {
      console.error(`Error fetching history for ${req.params.symbol}:`, error);
      res.status(500).json({ error: "Failed to fetch historical data" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.json([]);
      const results = (await yahooFinance.search(q as string)) as any;
      res.json(results.quotes);
    } catch (error) {
      console.error("Error searching stocks:", error);
      res.status(500).json({ error: "Failed to search stocks" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
