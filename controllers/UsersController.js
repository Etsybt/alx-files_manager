import dbClient from '../utils/db';

const { ObjectId } = require('mongodb');
const crypto = require('crypto');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const existingUser = await dbClient.getUser({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      const newUser = {
        _id: new ObjectId(), // Explicitly set the ObjectId
        email,
        password: hashedPassword,
      };

      await dbClient.db.collection('users').insertOne(newUser);

      return res.status(201).json({
        id: newUser._id,
        email: newUser.email,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UsersController;
