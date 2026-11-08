import { Router } from "express";

import { validate } from "../../middleware/validate";
import { downloadAudio, getVideoInfo } from "./ytb.controller";
import { videoInfoSchema } from "./ytb.schema";

const router = Router();

router.post("/info", validate({ body: videoInfoSchema }), getVideoInfo);
router.post("/download", validate({ body: videoInfoSchema }), downloadAudio);

export default router;
