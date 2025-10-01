const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require('./routes/url');
const URL = require("./models/url");
const app = express();
const PORT = 8001;

// For full debugging of mongoose queries
const mongoose = require("mongoose");
mongoose.set('debug', true); // This will log every query mongoose runs

// Connect to MongoDB with debugging
connectToMongoDB('mongodb://localhost:27017/short-url')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use(express.json());

// Debug incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  if (Object.keys(req.body).length > 0) {
    console.log("Request body:", req.body);
  }
  next();
});

app.use("/url", urlRoute);

// Debug the redirect route, especially the visitHistory push
app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  console.log("Looking up shortId:", shortId);

app.get()

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      console.warn(`No URL found for shortId: ${shortId}`);
      return res.status(404).send("ShortId not found");
    }

    console.log("Entry after visitHistory push:", entry);
    console.log("Current visitHistory array:", entry.visitHistory);

    res.redirect(entry.redirectURL);

  } catch (error) {
    console.error("Error handling /:shortId route:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
