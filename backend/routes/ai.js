import express from "express";
import { Candidate } from "./candidates.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/shortlist", async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills = [] } = req.body;

    const candidates = await Candidate.find({
      experience: { $gte: minExperience },
    });

    if (!candidates.length) {
      return res.json({ result: "No candidates found matching criteria." });
    }

    const candidateList = candidates
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} | Skills: ${c.skills.join(", ")} | Experience: ${c.experience} years${c.bio ? ` | Bio: ${c.bio}` : ""}`
      )
      .join("\n");

    const prompt = `You are an expert technical recruiter. Analyze these candidates and rank them.

Job Requirements:
- Required Skills: ${requiredSkills.join(", ")}
- Preferred Skills: ${preferredSkills.join(", ") || "None"}
- Minimum Experience: ${minExperience} years

Candidates:
${candidateList}

Please:
1. Rank the top 3 candidates
2. For each, explain WHY they are a good fit (2-3 sentences)
3. Mention any skill gaps
4. Suggest 2 interview questions per top candidate

Format your response clearly with sections for each candidate.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://candidate-shortlist.vercel.app",
          "X-Title": "Candidate Shortlist System",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1500,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const result = data.choices?.[0]?.message?.content || "No response from AI";
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;