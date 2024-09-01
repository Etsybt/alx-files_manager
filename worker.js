import Queue from 'bull';
import imageThumbnail from 'image-thumbnail';
import path from 'path';
import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';

// Initialize the Bull queue
const fileQueue = new Queue('fileQueue', process.env.REDIS_URL);

async function main() {
  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  const db = client.db('yourDatabaseName');

  fileQueue.process(async (job) => {
    const { userId, fileId } = job.data;

    if (!fileId) throw new Error('Missing fileId');
    if (!userId) throw new Error('Missing userId');

    const file = await db.collection('files').findOne({ _id: new ObjectId(fileId), userId });

    if (!file) throw new Error('File not found');

    const sizes = [500, 250, 100];
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    for (const size of sizes) {
      try {
        const localPath = path.join(folderPath, file.localPath);
        const thumbnailPath = path.join(folderPath, `${path.basename(file.localPath, path.extname(file.localPath))}_${size}${path.extname(file.localPath)}`);

        const thumbnail = await imageThumbnail(localPath, { width: size });
        fs.writeFileSync(thumbnailPath, thumbnail);
      } catch (error) {
        throw new Error(`Error generating thumbnail of size ${size}: ${error.message}`);
      }
    }
  });
}

main().catch((error) => {
  console.error('Error starting worker:', error);
  process.exit(1);
});
