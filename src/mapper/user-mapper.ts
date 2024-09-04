import { AddressDto } from "../dtos/address-dto";
import { UserDto } from "../dtos/user-dto";
import { User } from "../models/User";
import { ICepService } from "../services/cep-service";

export class UserMapper {
  
  static toEntity(raw: any): User | null {
    if(!raw) { return null; }
    if(raw.name === undefined || raw.age === undefined || raw.gender === undefined || raw.cep === undefined) return null;
    return new User(raw.id, raw.name, raw.age, raw.gender, raw.cep);
  }
  static async toDto(user: User, cepService: ICepService): Promise<UserDto> {
    const address = await AddressDto.fromCep(user.cep, cepService);
    return {
      id: user.id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      address,
    };
  }
}