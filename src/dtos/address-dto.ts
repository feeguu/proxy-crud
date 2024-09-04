import { ICepService } from "../services/cep-service";

export class AddressDto {
  constructor(
    public street: string,
    public city: string,
    public state: string,
    public postalCode: string
  ) {}

  static async fromCep(cep: string, cepService: ICepService): Promise<AddressDto> {
    const address = await cepService.fetchCep(cep);
    if(!address) {
      return new AddressDto("", "", "", "");
    }
    return address;
  }
}