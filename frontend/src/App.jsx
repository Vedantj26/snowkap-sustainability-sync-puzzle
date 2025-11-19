import React, { useState } from "react";

const BACKEND_URL = "http://localhost:4000";

export default function App() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleSync = async () => {
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(`${BACKEND_URL}/sync`);
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError("Failed to sync data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                margin: 0,
                padding: "20px",
                background: "#0f172a",
                color: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "800px",
                    background: "#1e293b",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                    border: "1px solid #334155",
                    boxSizing: "border-box"
                }}
            >
                <h1
                    style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        marginBottom: "8px",
                        textAlign: "center"
                    }}
                >
                    Sustainability Sync Board
                </h1>

                <p
                    style={{
                        fontSize: "14px",
                        textAlign: "center",
                        color: "#94a3b8",
                        marginBottom: "20px"
                    }}
                >
                    Ingest emission data from 3 sources → Normalize → Unify → Display
                </p>

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <button
                        onClick={handleSync}
                        disabled={loading}
                        style={{
                            padding: "10px 20px",
                            background: loading ? "#64748b" : "#22c55e",
                            color: "#0f172a",
                            border: "none",
                            borderRadius: "999px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            fontSize: "14px"
                        }}
                    >
                        {loading ? "Syncing..." : "Sync Data"}
                    </button>
                </div>

                {error && (
                    <div
                        style={{
                            background: "#7f1d1d",
                            color: "#fecaca",
                            borderRadius: "8px",
                            padding: "10px",
                            textAlign: "center",
                            marginBottom: "16px",
                            fontSize: "14px"
                        }}
                    >
                        {error}
                    </div>
                )}

                {result && (
                    <div
                        style={{
                            background: "#0f172a",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "1px solid #334155"
                        }}
                    >
                        <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                            ✅ <strong>{result.message}</strong>
                        </p>

                        <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
                            Unified Scope 1 Emissions
                        </h2>

                        <p
                            style={{
                                fontSize: "32px",
                                margin: "0 0 10px 0",
                                fontWeight: 700
                            }}
                        >
                            {result.unified.value_tonnes}{" "}
                            <span style={{ fontSize: "16px", color: "#94a3b8" }}>tonnes</span>
                        </p>

                        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                            Metric: {result.unified.metric} • Sources:{" "}
                            {result.unified.source_count}
                        </p>

                        <h3
                            style={{
                                marginTop: "20px",
                                fontSize: "16px",
                                fontWeight: 600,
                                marginBottom: "10px"
                            }}
                        >
                            Source Breakdown
                        </h3>

                        <div style={{ overflowX: "auto" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "13px",
                                    color: "#e2e8f0"
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={th}>Source</th>
                                        <th style={th}>Field</th>
                                        <th style={thRight}>Raw</th>
                                        <th style={thRight}>Unit</th>
                                        <th style={thRight}>Tonnes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.unified.details.map((d, idx) => (
                                        <tr key={idx}>
                                            <td style={td}>{d.source}</td>
                                            <td style={td}>{d.original_key}</td>
                                            <td style={tdRight}>{d.original_value}</td>
                                            <td style={tdRight}>{d.unit}</td>
                                            <td style={tdRight}>{d.value_tonnes.toFixed(3)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const th = {
    textAlign: "left",
    padding: "8px 4px",
    borderBottom: "1px solid #334155"
};

const thRight = {
    ...th,
    textAlign: "right"
};

const td = {
    padding: "8px 4px",
    borderBottom: "1px solid #334155"
};

const tdRight = {
    padding: "8px 4px",
    textAlign: "right",
    borderBottom: "1px solid #334155"
};
