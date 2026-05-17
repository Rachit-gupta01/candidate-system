import { useState, useEffect } from "react";
import AddCandidate from "./components/AddCandidate.jsx";
import JobForm from "./components/JobForm.jsx";
import CandidateList from "./components/CandidateList.jsx";
import ShortlistedResult from "./components/ShortlistedResult.jsx";

const API = "https://candidate-system-852a.onrender.com";;

export default function App() {
  const [tab, setTab] = useState("match");
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    const res = await fetch(`${API}/api/candidates`);
    const data = await res.json();
    setCandidates(data);
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleMatch = async (jobData, useAI) => {
    setLoading(true);
    setAiResult("");
    try {
      const res = await fetch(`${API}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      const data = await res.json();
      setResults(data);

      if (useAI) {
        const aiRes = await fetch(`${API}/api/ai/shortlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });
        const aiData = await aiRes.json();
        setAiResult(aiData.result || aiData.error);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const tabs = [
    { id: "match", label: "🎯 Find Candidates" },
    { id: "add", label: "➕ Add Candidate" },
    { id: "all", label: "👥 All Candidates" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--surface)",
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-head)",
            fontSize: "1.8rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            TalentAI
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: 2 }}>
            AI-Powered Candidate Shortlisting
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: tab === t.id ? "var(--accent)" : "var(--border)",
              background: tab === t.id ? "var(--accent)" : "transparent",
              color: "var(--text)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              fontWeight: tab === t.id ? 600 : 400,
              transition: "all 0.2s",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
        {tab === "add" && (
          <AddCandidate API={API} onAdded={fetchCandidates} />
        )}
        {tab === "all" && (
          <CandidateList
            candidates={candidates}
            API={API}
            onDeleted={fetchCandidates}
          />
        )}
        {tab === "match" && (
          <>
            <JobForm onMatch={handleMatch} loading={loading} />
            {(results.length > 0 || aiResult) && (
              <ShortlistedResult results={results} aiResult={aiResult} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
