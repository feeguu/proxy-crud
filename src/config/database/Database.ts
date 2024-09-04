export abstract class Database {
  abstract connect(): void;
  abstract disconnect(): void;
  abstract getClient(): any;
}