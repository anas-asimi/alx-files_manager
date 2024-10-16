import { randomUUID, createHash } from 'crypto';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export const getConnect = async (req, res) => {
  try {
    /** @type{String} */
    const authHeader = req.header('Authorization');

    if (authHeader) {
      const b64String = authHeader.split(' ')[1];
      const bufferObj = Buffer.from(b64String, 'base64');
      const [email, password] = bufferObj.toString('utf8').split(':');
      if (!email || !password) return res.sendStatus(400);

      const existingUser = await dbClient.db
        .collection('users')
        .findOne({ email });

      const passedHash = createHash('sha1')
        .update(password, 'utf-8')
        .digest('hex');
      if (passedHash !== existingUser.password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = randomUUID();
      const tokenKey = `auth_${token}`;
      await redisClient.set(tokenKey, existingUser._id, 24 * 60 * 60);

      return res.status(200).json({ token });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (error) {
    console.log(`getConnect Error: ${error}`);
    return res.sendStatus(500);
  }
};

export const getDisconnect = async (req, res) => {
  try {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const tokenKey = `auth_${token}`;
    const _id = await redisClient.get(tokenKey);
    if (!_id) return res.status(401).json({ error: 'Unauthorized' });

    const existingUser = await dbClient.db
      .collection('users')
      .findOne({ _id: new ObjectId(_id) });
    if (!existingUser) return res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(tokenKey);
    return res.status(204).json({});
  } catch (error) {
    console.log(`getDisconnect Error: ${error}`);
    return res.sendStatus(500);
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const tokenKey = `auth_${token}`;
    const _id = await redisClient.get(tokenKey);
    if (!_id) return res.status(401).json({ error: 'Unauthorized' });
    const existingUser = await dbClient.db
      .collection('users')
      .findOne({ _id: new ObjectId(_id) });
    if (!existingUser) return res.status(401).json({ error: 'Unauthorized' });

    return res
      .status(200)
      .json({ email: existingUser.email, id: existingUser._id });
  } catch (error) {
    console.log(`getMe Error: ${error}`);
    return res.sendStatus(500);
  }
};
