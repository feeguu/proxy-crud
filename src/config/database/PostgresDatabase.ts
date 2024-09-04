import pg, { PoolClient, QueryResult } from "pg";
import { Database } from "./Database";

export class PostgresDatabase extends Database {
  private conn: PoolClient | undefined = undefined;
  connect() {
    const start = process.hrtime(); 
    console.log('[Connection] Connecting to Postgres...');
    const pool = new pg.Pool(
      {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT ?? '5432'),
      }
    ); // Connect to Postgres
    pool.connect((err, conn) => {
      if (err) {
        throw err;
      }
      this.conn = conn;
    });
    const end = process.hrtime(start);
    console.log('[Connection] Connected to Postgres in %d ms', end[1] / 1000000);
  }
  disconnect(): void {
    console.log('Disconnecting from Postgres');
  }

  getClient(): PoolClient {
    if(!this.conn) {
      throw new Error('Database connection not established');
    }
    return this.conn as PoolClient;
  }

  
}