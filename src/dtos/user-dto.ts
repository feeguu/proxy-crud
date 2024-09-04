import { AddressDto } from "./address-dto";

export class UserDto {
  constructor(
    public id: string,
    public name: string,
    public age: number,
    public gender: string,
    public address: AddressDto
  ){}
}