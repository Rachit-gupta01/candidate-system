import { useState } from "react";

export default function JobForm({ onMatch, loading }) {
  const [req, setReq] = useState("React, Node.js");
  const [pref, setPref] = useState("MongoDB, AWS");
  const [exp, setExp] = useState("1");
  const [useAI, setUseAI] = useState(false);

  const handle = () => {
    onMatch({
      requiredSkills: req.split(",").map((s) => s.trim()).filter(Boolean),
      preferredSkills: pref.split(",").map((s) => s.trim()).filter(Boolean),
      minExperience: parseFloat(exp) || 0,
    }, useAI);
  };

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "16px", padding: "32px", marginBottom: 32,
    }}>
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", marginBottom: 6 }}>
        🎯 Job Requirements
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 24 }}>
        Enter what you're looking for and we'll rank the best candidates
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.5fr", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Required Skills *", val: req, set: setReq, ph: "React, Node.js, Python" },
          { label: "Preferred Skills", val: pref, set: setPref, ph: "AWS, Docker, TypeScript" },
          { label: "Min Experience (yrs)", val: exp, set: setExp, ph: "1" },
        ].map((f) => (
          <div key={f.label}>
            <label style={{ fontSize: "0.78rem", color: "var(--muted)", display: "block", marginBottom: 6 }}>
              {f.label}
            </label>
            <input value={f.val} onChange={(e) => f.set(e.target.value)}
              placeholder={f.ph} style={inputStyle} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={handle} disabled={loading} style={{
          padding: "12px 28px", background: loading ? "var(--border)" : "var(--accent)",
          border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer", fontSize: "0.95rem",
          fontFamily: "var(--font-head)",
        }}>
          {loading ? "Matching..." : "Find Candidates"}
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={useAI} onChange={(e) => setUseAI(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
          <span style={{ fontSize: "0.9rem" }}>
            🤖 Also get <strong>AI Analysis</strong>
          </span>
        </label>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 13px",
  background: "var(--surface2)", border: "1px solid var(--border)",
  borderRadius: "8px", color: "var(--text)", fontSize: "0.9rem",
  fontFamily: "var(--font-body)", outline: "none",
};