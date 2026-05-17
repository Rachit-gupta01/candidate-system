import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const tierColor = { High: "#00d4a0", Medium: "#ffd166", Low: "#ff6584" };

export default function ShortlistedResult({ results, aiResult }) {
  const chartData = results.slice(0, 8).map((r) => ({
    name: r.name.split(" ")[0],
    score: r.matchScore,
    tier: r.tier,
  }));

  return (
    <div>
      {/* Chart */}
      {chartData.length > 0 && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: 24, marginBottom: 24,
        }}>
          <h3 style={{ fontFamily: "var(--font-head)", marginBottom: 20 }}>
            📊 Match Score Overview
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(v) => [`${v}%`, "Match"]}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={tierColor[d.tier]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cards */}
      <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.3rem", marginBottom: 16 }}>
        🏆 Shortlisted Candidates ({results.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {results.map((r, i) => (
          <div key={r._id} style={{
            background: "var(--surface)", border: "1px solid",
            borderColor: i === 0 ? tierColor[r.tier] + "55" : "var(--border)",
            borderRadius: "12px", padding: "20px",
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%",
              background: `conic-gradient(${tierColor[r.tier]} ${r.matchScore * 3.6}deg, var(--surface2) 0deg)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "var(--surface)", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, color: tierColor[r.tier],
              }}>
                {r.matchScore}%
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h4 style={{ fontFamily: "var(--font-head)", fontSize: "1rem" }}>{r.name}</h4>
                <span style={{
                  padding: "2px 10px", borderRadius: "20px", fontSize: "0.72rem",
                  background: tierColor[r.tier] + "22", color: tierColor[r.tier], fontWeight: 600,
                }}>{r.tier} Match</span>
                {i === 0 && <span style={{ fontSize: "0.72rem", color: "#ffd166" }}>⭐ Top Pick</span>}
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 8 }}>
                📅 {r.experience} yrs experience
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {r.skills.map((s) => (
                  <span key={s} style={{
                    padding: "2px 8px", fontSize: "0.72rem", borderRadius: "20px",
                    background: r.matchedSkills?.map(m => m.toLowerCase()).includes(s.toLowerCase())
                      ? "var(--green)22" : "var(--surface2)",
                    border: "1px solid",
                    borderColor: r.matchedSkills?.map(m => m.toLowerCase()).includes(s.toLowerCase())
                      ? "var(--green)55" : "var(--border)",
                    color: r.matchedSkills?.map(m => m.toLowerCase()).includes(s.toLowerCase())
                      ? "var(--green)" : "var(--muted)",
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Result */}
      {aiResult && (
        <div style={{
          background: "linear-gradient(135deg, #6c63ff11, #ff658411)",
          border: "1px solid var(--accent)",
          borderRadius: "16px", padding: 28,
        }}>
          <h3 style={{ fontFamily: "var(--font-head)", marginBottom: 16 }}>
            🤖 AI Analysis & Interview Questions
          </h3>
          <pre style={{
            whiteSpace: "pre-wrap", fontFamily: "var(--font-body)",
            fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text)",
          }}>
            {aiResult}
          </pre>
        </div>
      )}
    </div>
  );
}