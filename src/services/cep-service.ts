import { Database } from "../config/database/Database";
import { RedisDatabase } from "../config/database/RedisDatabase";
import { AddressDto } from "../dtos/address-dto";

export interface ICepService {
  fetchCep(cep: string): Promise<AddressDto | null>;
}

export class CepService implements ICepService {
  async fetchCep(cep: string): Promise<AddressDto | null> {
    const start = process.hrtime();
    console.log(`https://viacep.com.br/ws/${cep}/json/`);
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    const end = process.hrtime(start);
    console.log(`[API] CEP fetched from API in ${end[1] / 1e6} ms`);
    if(data.erro) {
      return null;
    }
    return new AddressDto(data.logradouro, data.localidade, data.uf, data.cep);
  }
}

export class CepServiceProxy implements ICepService {
  constructor(private service: CepService, private cacheDatabase: RedisDatabase) {}

  async fetchCep(cep: string): Promise<AddressDto | null> {
    console.log("fetching cep", cep);
    const start = process.hrtime();
    const cache = await this.cacheDatabase.getClient().hGetAll(cep);
    const end = process.hrtime(start);
    console.log(`[Cache] Fetched from cache in ${end[1] / 1e6} ms`);

    if(Object.keys(cache).length === 0) {
      console.log(`[Cache] Cache miss for ${cep}`);
      const res = await this.service.fetchCep(cep);
      
      if(!res) {
        return null;
      }

      this.cacheDatabase.getClient().hSet(cep, new Map(Object.entries(res)));
      return res;
    }
    const address = new AddressDto(cache.street, cache.city, cache.state, cache.postalCode);
    return address;
  }
}