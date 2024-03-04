export default interface CacheRepository {
  fetchAllWithKey(
    keyPattern: string,
    { page, perPage }: { page: number; perPage: number }
  ): Promise<any[]>;

  countSetSize(key: string): Promise<number>;
}
