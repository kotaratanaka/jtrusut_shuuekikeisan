import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { createServer as createViteServer } from "vite";
import { calculateSimulation } from "./server/calcEngine.ts";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/calculate", (req, res) => {
    try {
      const data = req.body;
      const result = calculateSimulation(data);
      res.json(result);
    } catch (error: any) {
      console.error("Calculation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ocr", upload.single("file"), async (req, res) => {
    try {
      // Mock OCR for now, or use Gemini if GEMINI_API_KEY is available
      // For this prototype, we'll return mock extracted data
      const mockData = {
        property: {
          name: "サンプルレジデンス",
          address: "東京都港区六本木X-X-X",
          landArea: 150.5,
          buildingArea: 450.2,
          builtYear: 2015,
          structure: "RC",
        },
        rentRoll: {
          totalRent: 1500000,
          units: 10,
        }
      };
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      res.json(mockData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
