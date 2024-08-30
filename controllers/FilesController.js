import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb'; // Import ObjectId
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(req, res) {
    try {
      const userId = await FilesController.getUserFromToken(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        name, type, parentId = '0', isPublic = false, data,
      } = req.body;

      if (!name) return res.status(400).json({ error: 'Missing name' });
      if (!['folder', 'file', 'image'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
      }
      if (type !== 'folder' && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }

      // Convert parentId to ObjectId if it's not '0'
      let parentObjectId;
      if (parentId !== '0') {
        parentObjectId = ObjectId(parentId); // Convert string to ObjectId
        const parentFile = await dbClient.db.collection('files').findOne({ _id: parentObjectId });
        if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      const fileDocument = {
        userId,
        name,
        type,
        isPublic,
        parentId,
        localPath: null,
      };

      if (type !== 'folder') {
        const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
        const localPath = path.join(FOLDER_PATH, uuidv4());
        await fs.mkdir(FOLDER_PATH, { recursive: true });
        await fs.writeFile(localPath, Buffer.from(data, 'base64'));
        fileDocument.localPath = localPath;
      }

      const result = await dbClient.db.collection('files').insertOne(fileDocument);
      return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getShow(req, res) {
    try {
      const userId = await FilesController.getUserFromToken(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const fileId = req.params.id;
      const fileObjectId = ObjectId(fileId); // Convert string to ObjectId
      const file = await dbClient.db.collection('files').findOne({ _id: fileObjectId, userId });

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.status(200).json(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getIndex(req, res) {
    try {
      const userId = await FilesController.getUserFromToken(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { parentId = '0', page = 0 } = req.query;
      const PAGE_SIZE = 20;

      let parentObjectId;
      if (parentId !== '0') {
        parentObjectId = ObjectId(parentId); // Convert string to ObjectId
      }

      const files = await dbClient.db.collection('files').aggregate([
        { $match: { userId, ...(parentId !== '0' ? { parentId: parentObjectId } : {}) } },
        { $skip: parseInt(page) * PAGE_SIZE },
        { $limit: PAGE_SIZE },
        { $project: { _id: 1, name: 1, type: 1, isPublic: 1, parentId: 1 } },
      ]).toArray();

      return res.status(200).json(files);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getUserFromToken(req) {
    const token = req.header('X-Token');
    if (!token) return null;

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return null;

    return userId;
  }
}

export default FilesController;
