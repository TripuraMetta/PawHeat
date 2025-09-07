const express = require("express");
const Donation = require("../models/Donation");

const router = express.Router();

// POST: Add donation
router.post("/", async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json({ message: "Donation saved successfully!", donation });
  } catch (error) {
    res.status(500).json({ error: "Failed to save donation" });
  }
});

// GET: All donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

module.exports = router;
