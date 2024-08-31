import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/`;

class DBClient {
  constructor() {
    this.db = null;
    this.initialize();
  }

  async initialize() {
    try {
      const client = await MongoClient.connect(url, { useUnifiedTopology: true });
      this.db = client.db(database);

      await this.createCollectionIfNotExists('users');
      await this.createCollectionIfNotExists('files');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }

  async createCollectionIfNotExists(collectionName) {
    const collections = await this.db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      await this.db.createCollection(collectionName);
    }
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async getUser(query) {
    const user = await this.db.collection('users').findOne(query);
    return user;
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }

  // New method to retrieve a file
  async getFile(query) {
    const file = await this.db.collection('files').findOne(query);
    return file;
  }
}

const dbClient = new DBClient();
export default dbClient;
