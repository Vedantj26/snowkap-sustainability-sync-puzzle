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
            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody.error || errBody.message || "Sync failed");
            }
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                background: "#0f172a",
                color: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px"
            }}
        >
            <div
                style={{
                    maxWidth: "720px",
                    width: "100%",
                    background: "#020617",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 20px 40px rgba(15,23,42,0.8)",
                    border: "1px solid #1f2937"
                }}
            >
                <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
                    Sustainability Sync Board
                </h1>

                <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "16px" }}>
                    Prototype that ingests emissions from 3 sources, normalizes them, and
                    displays a unified Scope 1 emission value.
                </p>

                {/* Sync Button */}
                <button
                    onClick={handleSync}
                    disabled={loading}
                    style={{
                        padding: "10px 18px",
                        background: loading ? "#4b5563" : "#22c55e",
                        color: "#020617",
                        borderRadius: "999px",
                        border: "none",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        marginBottom: "16px"
                    }}
                >
                    {loading ? "Syncing..." : "Sync Data"}
                </button>

                {/* Error Box */}
                {error && (
                    <div
                        style={{
                            marginTop: "8px",
                            padding: "8px 12px",
                            background: "#7f1d1d",
                            borderRadius: "8px",
                            fontSize: "13px",
                            color: "#fecaca"
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Sync Result */}
                {result && (
                    <div
                        style={{
                            marginTop: "20px",
                            padding: "16px",
                            background: "#020617",
                            borderRadius: "12px",
                            border: "1px solid #1f2937"
                        }}
                    >
                        <div style={{ marginBottom: "8px", fontSize: "14px" }}>
                            ✅ <strong>{result.message}</strong>
                        </div>

                        <h2 style={{ fontSize: "18px", marginBottom: "4px" }}>
                            Unified Scope 1 Emissions
                        </h2>

                        <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>
                            {result.unified.value_tonnes}{" "}
                            <span style={{ fontSize: "16px", color: "#9ca3af" }}>tonnes</span>
                        </p>

                        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>
                            Metric: {result.unified.metric} | Sources:{" "}
                            {result.unified.source_count}
                        </p>

                        {/* Table */}
                        <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                            <div style={{ marginBottom: "6px", fontWeight: 600 }}>
                                Source breakdown:
                            </div>

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
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
    paddingBottom: "6px",
    borderBottom: "1px solid #1f2937"
};

const thRight = {
    ...th,
    textAlign: "right"
};

const td = {
    padding: "4px 0"
};

const tdRight = {
    padding: "4px 0",
    textAlign: "right"
};
