import { createHash } from 'crypto';
import dbClient from '../utils/db';

const addUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const existingUser = await dbClient.db
      .collection('users')
      .findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = createHash('sha1')
      .update(password, 'utf-8')
      .digest('hex');
    const newUser = await dbClient.db
      .collection('users')
      .insertOne({ email, password: hashedPassword });
    return res.status(201).json({ email, id: newUser.insertedId });
  } catch (error) {
    console.log(`addUser Controller: ${error}`);
    return res.sendStatus(500);
  }
};

export default addUser;
