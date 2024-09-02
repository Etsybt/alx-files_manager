import redisClient from '../utils/redis';

describe('redisClient', () => {
  beforeAll(() => {
    redisClient.client.flushdb(); // Clear Redis before tests
  });

  test('isAlive should return true if Redis is connected', () => {
    expect(redisClient.isAlive()).toBe(true);
  });

  test('set and get should store and retrieve a key', async () => {
    await redisClient.set('myKey', 'myValue', 10);
    const value = await redisClient.get('myKey');
    expect(value).toBe('myValue');
  });

  test('del should remove a key', async () => {
    await redisClient.set('deleteKey', 'deleteValue', 10);
    await redisClient.del('deleteKey');
    const value = await redisClient.get('deleteKey');
    expect(value).toBeNull();
  });
});
