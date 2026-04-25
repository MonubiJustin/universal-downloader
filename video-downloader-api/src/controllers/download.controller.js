const {
    getFormats,
    getVideoInfo,
    getAudio
} = require("../services/downloader.service.js");

// GET video info + best download URL
const getInfo = async (req, res, next) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({
            error: "url is required in the request body"
        });

        const info = await getVideoInfo(url);

        res.json(info);
        
    } catch (error) {
        next(error)
    }
}

// GET all available formarts/qualities for a URL
const getAllFormats = async (req, res, next) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({
            error: "url is required in the request body"
        });
        const formarts = await getFormats(url);
        res.json(formarts);
    } catch (error) {
        next(error)
    }
}

// Get mp3 for video
const getMp3 = async (req, res, next) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({
            error: "url is required in the request body"
        });


        const audio = await getAudio(url);
        return res.status(200).json(audio);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getInfo,
    getAllFormats,
    getMp3
}