import { Database } from "./Database";
import { PostgresDatabase } from "./PostgresDatabase";
import { RedisDatabase } from "./RedisDatabase";

export enum DatabaseType {
  MYSQL,
  POSTGRES,
  MONGODB,
  REDIS,
}

export class DatabaseFactory {
  public static createDatabase(type: DatabaseType): Database {
    switch (type) {
      case DatabaseType.MYSQL:
        // return new MysqlDatabase();
      case DatabaseType.POSTGRES:
        return new PostgresDatabase();
      case DatabaseType.MONGODB:
        // return new MongodbDatabase();
      case DatabaseType.REDIS:
        return new RedisDatabase();
      default:
        throw new Error('Invalid database type');
    }
  }
}