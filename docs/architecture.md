# Snowkap Sustainability Sync Board – Architecture & Workflow

## 1. Overview

This prototype simulates how Scope 1 carbon emissions data flows from
different internal systems into a unified sustainability view.

The system has three main layers:

- **Frontend:** React-based dashboard with a "Sync Data" button and
  a small table to display normalized results.
- **Backend:** Node.js + Express API with a `/sync` endpoint that
  ingests mock data, normalizes it, and persists unified records.
- **Database:** A simple JSON file (`db.json`) acting as a lightweight
  store for normalized ESG records.

All components run locally and use mocked JSON files as data sources.

---

## 2. System Architecture

**Frontend (React)**  
- Renders a minimal "Sustainability Sync Board" UI.  
- Calls `GET http://localhost:4000/sync` when the user clicks **Sync Data**.  
- Displays:
  - Sync message (e.g., “Synced 3 sources”)  
  - Unified Scope 1 emissions value in tonnes  
  - Per-source normalization details (key, original value, unit, normalized tonnes)

**Backend (Node.js + Express)**  
- Exposes:
  - `GET /sync` – main workflow endpoint  
  - `GET /history` – optional endpoint showing saved unified records  
- Reads mock data from three files in `/data`:
  - `erp.json`
  - `supplier_portal.json`
  - `iot_sensor.json`
- Uses `normalization.js` to:
  - Detect which fields correspond to Scope 1 emissions
  - Infer units from field names (kg vs tonnes)
  - Convert and unify to `value_tonnes`
- Persists each unified record to `db.json`.

**Database (JSON file)**  
- `backend/db.json` acts as a mock persistent store.  
- Each new sync appends a record:
  ```json
  {
    "metric": "Scope 1 Emissions",
    "value_tonnes": 243.0,
    "source_count": 3,
    "details": [...],
    "timestamp": "2025-11-19T10:00:00.000Z"
  }
