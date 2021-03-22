import express, { Request, Response, NextFunction } from "express";
export const app = express();

// Allow Express to stringify JSON to be interpreted correctly
app.use(express.json());

// Allow other origins to call Express endpoints
import cors from "cors";
app.use(cors({ origin: true }));

// Test endpoint
app.post("/test", (req: Request, res: Response) => {
  const amount = req.body.amount;

  res.status(200).send({ with_tax: amount * 1.07 });
});
