const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors=require("cors");
const donationRoutes = require("./routes/donationRoutes"); // external routes
const Donation = require("./models/Donation");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware: parse JSON requests
app.use(cors());
app.use(express.json());

// ✅ Money donation endpoint (dummy receipt generator)
app.post("/api/donations/money", async (req, res) => {
  try {
    const { name, amount, upiId } = req.body;

    if (!name || !amount || !upiId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Save donation in DB
    const donation = new Donation({
      type: "money",
      name,
      amount,
      upiId,
      date: new Date(),
    });
    await donation.save();

    // Dummy receipt
    const receipt = {
      receiptId: `RCPT-${Date.now()}`,
      name,
      amount,
      upiId,
      date: donation.date,
    };

    res.status(201).json({
      success: true,
      message: "Donation recorded successfully!",
      receipt,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Mount other donation routes (food, fabric, etc.)
app.use("/api/donations", donationRoutes);

// ✅ Get all donations
app.get("/donations", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
