import { useState, useEffect } from "react";
import AddCandidate from "./components/AddCandidate.jsx";
import JobForm from "./components/JobForm.jsx";
import CandidateList from "./components/CandidateList.jsx";
import ShortlistedResult from "./components/ShortlistedResult.jsx";

const API = "https://candidate-system-852a.onrender.com";

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

  useEffect(() => {
    fetchCandidates();
  }, []);

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f4f7fb, #eef2ff)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "18px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#4f46e5",
              margin: 0,
            }}
          >
            TalentAI
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "0.9rem",
              marginTop: "4px",
            }}
          >
            AI-Powered Candidate Shortlisting
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                background: tab === t.id ? "#4f46e5" : "#ffffff",
                color: tab === t.id ? "#ffffff" : "#334155",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow:
                  tab === t.id
                    ? "0 4px 12px rgba(79,70,229,0.25)"
                    : "0 2px 6px rgba(0,0,0,0.05)",
                transition: "0.3s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
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
              <ShortlistedResult
                results={results}
                aiResult={aiResult}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
