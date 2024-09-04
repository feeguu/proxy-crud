import { Request, Response } from "express";
import { User } from "../models/User";
import { Repository } from "../repository/Repository";
import { UserMapper } from "../mapper/user-mapper";
import { ICepService } from "../services/cep-service";

export class UserController {
  constructor(private userRepository: Repository<User>, private cepService: ICepService) {}


  public async findOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await this.userRepository.findOne(id);
    if(!user) {
      res.status(404).json({message: "User not found"});
      return;
    }
    const userMapped = await UserMapper.toDto(user, this.cepService);
    res.status(200).json(userMapped);
  }

  public async find(req: Request, res: Response): Promise<void> {
    const users = await this.userRepository.find();
    const mappedUsers = await Promise.all(users.map(async user => {
      return await UserMapper.toDto(user, this.cepService);
    }));
    res.status(200).json(mappedUsers);
  }

  public async save(req: Request, res: Response): Promise<void> {
    const {name, age, cep, gender} = req.body;
    if(!name || !age || !cep || !gender) {
      res.status(400).json({message: "Invalid request body"});
      return;
    }

    const user = new User("0", name, age, gender, cep);
    const dbUser = await this.userRepository.save(user);
    const userMapped = await UserMapper.toDto(dbUser, this.cepService);
    res.status(201).json(userMapped);
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {name, age, gender, cep} = req.body;

    const user = await this.userRepository.findOne(id);

    if(user === null) {
      res.status(404).json({message: "User not found"});
      return;
    }

    if(name !== undefined) {
      user.name = name;
    }

    if(age !== undefined) {
      user.age = age;
    }

    if(cep !== undefined) {
      user.cep = cep
    }

    if(gender !== undefined) {
      user.gender = gender;
    }

    await this.userRepository.update(id, user);
    const userMapped = await UserMapper.toDto(user, this.cepService);
    res.status(200).json(userMapped);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.userRepository.delete(id);
    res.status(204).send();
  }
}