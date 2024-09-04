import { Database } from "./Database";
import {createClient, RedisClientType} from 'redis';

export class RedisDatabase extends Database {
  private client: RedisClientType | undefined = undefined;
  async connect(): Promise<void> {
    const start = process.hrtime();
    console.log('[Connection] Connecting to Redis...');
    this.client = createClient(); // Connect to Redis in localhost:6379
    await this.client.connect();
    const end = process.hrtime(start);
    console.log(`[Connection] Connected to Redis in ${end[1] / 1e6} ms`);
  }
  disconnect(): void {
    if(this.client) {
      this.client.quit();
    }
  }
  getClient(): RedisClientType {
    if(!this.client) {
      throw new Error('Database connection not established');
    }
    return this.client;
  }
}