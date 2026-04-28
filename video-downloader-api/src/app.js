const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require('dotenv');
const downloadRoutes = require("./routes/download.routes.js");
const YTDlpWrap = require("yt-dlp-wrap").default;
const path = require("path");
const fs = require("fs");

const YT_DLP_PATH = path.join(__dirname, 'yt-dlp');

const initYtDlp = async () => {
  // Only download if binary doesn't already exist
  if (!fs.existsSync(YT_DLP_PATH)) {
    console.log('yt-dlp binary not found - downloading ...');
    await YTDlpWrap.downloadFromGithub(YT_DLP_PATH);
    console.log("yt-dlp downloaded successfully");
  } else {
    console.log("yt-dlp binary already exists - skipping download");
  }
}

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use("/api/download", downloadRoutes);


// HEALTH CHECK
app.get("/health", (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
    })
})

// 404 Handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));


//  GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err.stack);
      res.status(500).json({ error: "Something went wrong", details: err.message })
}
  );

const startServer = async () => {

  await initYtDlp();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();


