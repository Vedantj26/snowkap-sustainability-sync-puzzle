import express from "express";
import cors from "cors";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import {
  normalizeSourceObject,
  unifyScopeMetrics
} from "./normalization.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

async function loadJSON(relativePath) {
  const fullPath = path.join(__dirname, "..", "data", relativePath);
  return fs.readJSON(fullPath);
}

const DB_PATH = path.join(__dirname, "db.json");

app.get("/sync", async (req, res) => {
  try {
    const erp = await loadJSON("erp.json");
    const supplier = await loadJSON("supplier_portal.json");
    const iot = await loadJSON("iot_sensor.json");

    const normalized = [
      ...normalizeSourceObject("ERP", erp),
      ...normalizeSourceObject("Supplier Portal", supplier),
      ...normalizeSourceObject("IoT Sensor", iot)
    ];

    const unifiedScope1 = unifyScopeMetrics(normalized, "scope_1");

    if (!unifiedScope1) {
      return res.status(400).json({
        message: "No Scope 1 metrics detected from sources."
      });
    }

    const db = {
      lastSyncAt: new Date().toISOString(),
      metrics: [unifiedScope1]
    };
    await fs.writeJSON(DB_PATH, db, { spaces: 2 });

    res.json({
      message: `Synced ${unifiedScope1.source_count} sources`,
      unified: unifiedScope1
    });
  } catch (err) {
    console.error("Error in /sync:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/metrics", async (req, res) => {
  try {
    if (!(await fs.pathExists(DB_PATH))) {
      return res.json({ lastSyncAt: null, metrics: [] });
    }
    const db = await fs.readJSON(DB_PATH);
    res.json(db);
  } catch (err) {
    console.error("Error in /metrics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
