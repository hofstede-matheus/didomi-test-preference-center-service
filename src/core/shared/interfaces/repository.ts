export interface Repository<T> {
  create(entity: T): Promise<void>;
  deleteById(id: string): Promise<void>;
  findById(id: string): Promise<T | null>;
}
