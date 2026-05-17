import { useState } from "react";

export default function AddCandidate({ API, onAdded }) {
  const [form, setForm] = useState({
    name: "", email: "", skills: "", experience: "", bio: "",
  });
  const [msg, setMsg] = useState("");

  const handle = async () => {
    if (!form.name || !form.skills) return setMsg("Name & skills required!");
    const body = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      experience: parseFloat(form.experience) || 0,
    };
    const res = await fetch(`${API}/api/candidates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg("✅ Candidate added!");
      setForm({ name: "", email: "", skills: "", experience: "", bio: "" });
      onAdded();
    } else setMsg("❌ Error adding candidate");
  };

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Rahul Sharma" },
    { key: "email", label: "Email", placeholder: "rahul@email.com" },
    { key: "skills", label: "Skills (comma separated)", placeholder: "React, Node.js, MongoDB" },
    { key: "experience", label: "Experience (years)", placeholder: "2" },
    { key: "bio", label: "Bio / Projects (optional)", placeholder: "Built e-commerce app..." },
  ];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.5rem", marginBottom: 24 }}>
        Add Candidate
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block", marginBottom: 6 }}>
              {f.label}
            </label>
            <input
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              style={inputStyle}
            />
          </div>
        ))}
        <button onClick={handle} style={btnStyle}>Add Candidate</button>
        {msg && <p style={{ color: msg.includes("✅") ? "var(--green)" : "var(--accent2)", fontSize: "0.9rem" }}>{msg}</p>}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px",
  background: "var(--surface2)", border: "1px solid var(--border)",
  borderRadius: "8px", color: "var(--text)", fontSize: "0.95rem",
  fontFamily: "var(--font-body)", outline: "none",
};

const btnStyle = {
  padding: "12px", background: "var(--accent)", border: "none",
  borderRadius: "8px", color: "#fff", fontWeight: 600,
  cursor: "pointer", fontSize: "1rem", fontFamily: "var(--font-head)",
};