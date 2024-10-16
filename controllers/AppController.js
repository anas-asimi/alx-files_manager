const { default: dbClient } = require('../utils/db');
const { default: redisClient } = require('../utils/redis');

export const getStatus = async (req, res) => {
  res.status(200).json({
    redis: redisClient.isAlive(),
    db: dbClient.isAlive(),
  });
};

export const getStats = async (req, res) => {
  res.status(200).json({
    users: await dbClient.nbUsers(),
    files: await dbClient.nbFiles(),
  });
};
