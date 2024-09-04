import { QueryResult } from "pg";
import { Database } from "../config/database/Database";
import { PostgresDatabase } from "../config/database/PostgresDatabase";
import { User } from "../models/User";
import { Repository } from "./Repository";
import { UserMapper } from "../mapper/user-mapper";

export class PostgresUserRepository extends Repository<User> {
  constructor(private database: PostgresDatabase) {
    super();
  }
  async findOne(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    const start = process.hrtime();
    console.log(`[Query] Executing query: ${query}`);
    const res = await this.database.getClient().query(query) as QueryResult<any>;
    const end = process.hrtime(start);
    console.log(`[Query] Executed query in ${end[1] / 1e6} ms`);
    if(res.rowCount === 0) { return null; }
    const user = res.rows[0];
    return new User(user.id, user.name, user.age, user.gender, user.cep);
  }
  async find(): Promise<User[]> {
    const users: User[] = [];
    const start = process.hrtime();
    console.log('[Query] Executing query: SELECT * FROM users');
    const res = await this.database.getClient().query('SELECT * FROM users') as QueryResult<User>;
    const end = process.hrtime(start);
    console.log(`[Query] Executed query in ${end[1] / 1e6} ms`);
    for(const user of res.rows) {
      users.push(new User(user.id, user.name, user.age, user.gender, user.cep));
    }

    return users;
  }
  async save(entity: User) {
    const query = `INSERT INTO users (name, age, gender, cep) VALUES ('${entity.name}', ${entity.age}, '${entity.gender}', '${entity.cep}') RETURNING *`;
    const start = process.hrtime();
    console.log(`[Query] Executing query: ${query}`);
    const res = await this.database.getClient().query(query);
    const end = process.hrtime(start);
    console.log(`[Query] Executed query in ${end[1] / 1e6} ms`);
    console.log(res.rows[0]);
    return UserMapper.toEntity(res.rows[0])!;
  }

  async update(id: string, entity: User): Promise<void> {
    
    const query = `UPDATE users SET name = '${entity.name}', age = ${entity.age}, cep = '${entity.cep}', gender = '${entity.gender}' WHERE id = ${id}`;
    console.log(`[Query] Executing query: ${query}`);
    const start = process.hrtime();
    const res = await this.database.getClient().query(query);
    const end = process.hrtime(start);
    console.log(`[Query] Executed query in ${end[1] / 1e6} ms`);
  }

  async delete(id: string): Promise<void> {
    console.log(`[Query] Executing query: DELETE FROM users WHERE id = ${id}`);
    const start = process.hrtime();
    await this.database.getClient().query(`DELETE FROM users WHERE id = ${id}`);
    const end = process.hrtime(start);
    console.log(`[Query] Executed query in ${end[1] / 1e6} ms`);
  }

  async findByColumn(column: string, value: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE ${column} = '${value}'`;
    console.log(`[Query] Executing query: ${query}`);
    const start = process.hrtime();
    const res = await this.database.getClient().query(query) as QueryResult<any>;
    const end = process.hrtime(start);
    console.log(`[Query] Executed query in ${end[1] / 1e6} ms`);
    if(res.rowCount === 0) { return null; }
    const user = res.rows[0];
    return new User(user.id, user.name, user.age, user.gender, user.cep);
  }
}