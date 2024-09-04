export abstract class Repository<T> {
  abstract find(): Promise<T[]>;
  abstract findOne(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<T>;
  abstract update(id: string, entity: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByColumn(column: string, value: string): Promise<T | null>;
}