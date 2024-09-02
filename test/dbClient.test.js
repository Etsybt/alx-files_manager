import dbClient from '../utils/db';

describe('dbClient', () => {
  beforeAll(async () => {
    await dbClient.db.collection('users').deleteMany({});
    await dbClient.db.collection('files').deleteMany({});
  });

  test('isAlive should return true if MongoDB is connected', () => {
    expect(dbClient.isAlive()).toBe(true);
  });

  test('nbUsers should return the correct number of users', async () => {
    await dbClient.db.collection('users').insertOne({ name: 'Test User' });
    const count = await dbClient.nbUsers();
    expect(count).toBe(1);
  });

  test('getUser should retrieve the correct user', async () => {
    const user = await dbClient.getUser({ name: 'Test User' });
    expect(user).toBeTruthy();
    expect(user.name).toBe('Test User');
  });

  test('nbFiles should return the correct number of files', async () => {
    await dbClient.db.collection('files').insertOne({ name: 'Test File' });
    const count = await dbClient.nbFiles();
    expect(count).toBe(1);
  });

  test('getFile should retrieve the correct file', async () => {
    const file = await dbClient.getFile({ name: 'Test File' });
    expect(file).toBeTruthy();
    expect(file.name).toBe('Test File');
  });
});
