import express from "express";
import { Candidate } from "./candidates.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills = [] } = req.body;

    const candidates = await Candidate.find({
      experience: { $gte: minExperience },
    });

    const scored = candidates.map((c) => {
      const reqMatched = c.skills.filter((s) =>
        requiredSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase())
      );
      const prefMatched = c.skills.filter((s) =>
        preferredSkills.map((p) => p.toLowerCase()).includes(s.toLowerCase())
      );

      const reqScore = requiredSkills.length
        ? reqMatched.length / requiredSkills.length
        : 0;
      const prefScore = preferredSkills.length
        ? prefMatched.length / preferredSkills.length
        : 0;

      const totalScore = Math.round((reqScore * 0.7 + prefScore * 0.3) * 100);

      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        skills: c.skills,
        experience: c.experience,
        bio: c.bio,
        matchScore: totalScore,
        matchedSkills: reqMatched,
        tier:
          totalScore >= 70 ? "High" : totalScore >= 40 ? "Medium" : "Low",
      };
    });

    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;