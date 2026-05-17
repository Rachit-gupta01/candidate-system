export default function CandidateList({ candidates, API, onDeleted }) {
  const del = async (id) => {
   if (!window.confirm("Delete this candidate?")) return;
    await fetch(`${API}/api/candidates/${id}`, { method: "DELETE" });
    onDeleted();
  };

  if (!candidates.length)
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>
        <p style={{ fontSize: "3rem" }}>👥</p>
        <p style={{ marginTop: 12 }}>No candidates yet. Add some!</p>
      </div>
    );

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", marginBottom: 24 }}>
        All Candidates ({candidates.length})
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {candidates.map((c) => (
          <div key={c._id} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "20px", position: "relative",
          }}>
            <button onClick={() => del(c._id)} style={{
              position: "absolute", top: 14, right: 14,
              background: "transparent", border: "none",
              color: "var(--muted)", cursor: "pointer", fontSize: "1rem",
            }}>✕</button>
            <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", marginBottom: 4 }}>
              {c.name}
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 12 }}>{c.email}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {c.skills.map((s) => (
                <span key={s} style={{
                  padding: "3px 10px", background: "var(--surface2)",
                  border: "1px solid var(--border)", borderRadius: "20px",
                  fontSize: "0.75rem", color: "var(--accent)",
                }}>{s}</span>
              ))}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              📅 {c.experience} yr{c.experience !== 1 ? "s" : ""} experience
            </p>
            {c.bio && <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 8 }}>{c.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}