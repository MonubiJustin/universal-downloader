import cors from "cors";
import express, { type Request, type Response } from "express";
import { pinoHttp } from "pino-http";

import { pinoHttpOptions } from "./config/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import youtubeRoutes from "./modules/youtube/ytb.routes.js";
import { HttpStatus } from "./utils/http-status.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use(pinoHttp(pinoHttpOptions));

app.get("/health", (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: "API running successfully",
  });
});

app.use("/api/youtube", youtubeRoutes);
app.use(notFound);
app.use(errorHandler);

export { app };
