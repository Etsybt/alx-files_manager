import request from 'supertest';
import app from '../server';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

describe('API Endpoints', () => {
  beforeAll(async () => {
    await dbClient.db.collection('users').deleteMany({});
    await dbClient.db.collection('files').deleteMany({});
    redisClient.client.flushdb();
  });

  test('GET /status should return 200 with Redis and DB status', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ redis: true, db: true });
  });

  test('GET /stats should return 200 with user and file counts', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ users: 0, files: 0 });
  });

  // Example for POST /users:
  test('POST /users should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  // Add tests for the other endpoints: GET /connect, GET /disconnect, GET /users/me,
  // POST /files, GET /files/:id, GET /files (with pagination), PUT /files/:id/publish,
  // PUT /files/:id/unpublish, GET /files/:id/data
});
