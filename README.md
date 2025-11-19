# 🌱 Sustainability Sync Board  
### Full-Stack Prototype · React + Node.js · ESG Data Normalization

This project is a lightweight prototype demonstrating how **sustainability (Scope 1 emissions) data** can be:

1. **Ingested** from multiple inconsistent systems  
2. **Normalized** using rule-based logic  
3. **Unified** into a clean ESG metric  
4. **Displayed** on a frontend dashboard  

It was built as a part of Snowkap’s **Full-Stack Developer Assignment**.

---

# 📁 Project Structure

```
snowkap-sustainability-sync/
├── backend/                # Node.js + Express API
│   ├── app.js              # API endpoints
│   ├── normalization.js    # Core normalization logic
│   ├── db.json             # Generated mock ESG database
│   └── package.json
│
├── frontend/               # React (Vite) UI
│   ├── src/App.jsx
│   ├── src/main.jsx
│   └── package.json
│
├── data/                   # Mock data sources
│   ├── erp.json
│   ├── supplier_portal.json
│   └── iot_sensor.json
│
├── docs/
│   └── architecture.md     # System design + data flow
│
└── README.md
```

---

# 🚀 Features

### ✔ **Ingest 3 different emission sources**
- ERP → `co2_scope_1`
- Supplier Portal → `direct_emission_tonnes`
- IoT Sensor → `scope1_kg`

### ✔ **Rule-based normalization logic**
- Detects “Scope 1” fields using keyword heuristics  
- Detects units based on field names (kg vs tonnes)  
- Converts all values into **tonnes**  

### ✔ **Unified ESG metric**
- Combines normalized values  
- Produces a single standard metric:

  **Unified Scope 1 Emissions (tonnes)**

### ✔ **Modern UI (React + Vite)**
- Single click → Sync all sources  
- Display unified emissions value  
- Show detailed breakdown table  

### ✔ **Lightweight persistence**
- Latest unified metrics stored in `backend/db.json`

---

# ⚙️ Getting Started

## 1️⃣ Clone the repository

```
git clone <your-repo-url>
cd snowkap-sustainability-sync
```

---

# 🖥️ Backend — Node.js / Express

### Install dependencies

```
cd backend
npm install
```

### Start server

```
npm start
```

Backend runs at:

👉 **http://localhost:4000**

### Test it:

```
http://localhost:4000/sync
```

---

# 🌐 Frontend — React (Vite)

### Install dependencies

```
cd ../frontend
npm install
```

### Start development server

```
npm run dev
```

Frontend runs at:

👉 **http://localhost:5173**

---

# 🔄 Full Workflow

1. Start backend  
2. Start frontend  
3. Open **http://localhost:5173**  
4. Click **Sync Data**  
5. You will see:

- `Synced 3 sources`  
- Unified Scope 1 emissions  
- Full normalization table (source → field → unit → tonnes)

---

# 🧠 Normalization Logic

### Step 1 — Field detection  
Identify Scope 1 fields using key patterns:

- `scope1`, `scope_1`
- `co2` + `scope`
- `direct` + `emission`

### Step 2 — Unit detection  
Field name analysis:

- contains `"kg"` → kilograms  
- contains `"tonne"` or `"tons"` → tonnes  
- fallback → tonnes  

### Step 3 — Unit conversion
```
kg → tonnes = value / 1000
```

### Step 4 — Unification  
Take the **average** of all normalized Scope 1 values.

---

# 📦 API Endpoints

### **GET /sync**
Runs the entire workflow:

- Load 3 JSON sources  
- Normalize  
- Convert units  
- Combine  
- Persist to db.json  

**Example response:**

```json
{
  "message": "Synced 3 sources",
  "unified": {
    "metric": "Scope 1 Emissions",
    "value_tonnes": 243,
    "source_count": 3,
    "details": [...]
  }
}
```

---

# 📘 Documentation

Full explanation of architecture, data flow, normalization, and scalability is in:

```
docs/architecture.md
```

---

# 🚀 Future Improvements

- Support for Scope 2 & Scope 3  
- AI-based field name classification  
- Weighted unification (based on source reliability)  
- Real database (MongoDB / Postgres)  
- CSV ingestion support  

---

# 🎯 What This Project Demonstrates

- Full-stack system thinking  
- Backend workflow & normalization logic  
- React UI integrations  
- ESG emissions context awareness  
- Clean and modular code  
- Scalability planning  
