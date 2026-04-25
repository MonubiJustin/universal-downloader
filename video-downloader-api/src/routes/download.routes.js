const express = require("express");
const {
    getAllFormats,
    getInfo,
    getMp3
} = require("../controllers/download.controller.js");


const router = express.Router();
router.post("/info", getInfo);
router.post("/formats", getAllFormats);
router.post("/audio", getMp3);


module.exports = router;