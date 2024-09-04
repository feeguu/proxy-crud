import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { Repository } from "../repository/Repository";

import {hash, compare} from "bcrypt";
import { TokenService } from "../services/token-service";

export class AuthController {
  constructor(private adminRepository: Repository<Admin>, private tokenService: TokenService) {}

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if(!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Check if admin exists
    const admin = await this.adminRepository.findByColumn("email", email);
    if (!admin) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Check if password is correct
    if ((await compare(password, admin.password)) === false) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = await this.tokenService.createToken({ email: admin.email });
    // Successful login
    res.status(200).json({ token });
  }

  public async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if(!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Check if admin with the same email already exists
    const existingAdmin = await this.adminRepository.findByColumn("email", email);
    if (existingAdmin) {
      res.status(409).json({ message: "Admin with the same email already exists" });
      return;
    }

    // Create a new admin
    const hashedPassword = await hash(password, 10);
    const admin = new Admin("", email, hashedPassword);
    await this.adminRepository.save(admin);

    const token = await this.tokenService.createToken({ email: admin.email });
    // Successful registration
    res.status(201).json({ token });
  }
}