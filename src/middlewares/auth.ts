import { NextFunction, Request, Response } from "express";
import { TokenService } from "../services/token-service";

const tokenService = new TokenService(process.env.SECRET ?? ""); 

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  // Check if token is valid
  try {
    const payload = await tokenService.verifyToken(token);
    req.body.auth = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}