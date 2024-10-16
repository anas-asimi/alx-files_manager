import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Class representing a Redis client.
 */
class RedisClient {
  /**
   * Create a Redis client.
   */
  constructor() {
    this.myClient = createClient();
    this.myClient.on('error', (error) => console.log(error));
  }

  /**
   * Check if the Redis client is alive.
   * @returns {boolean} True if the client is connected, false otherwise.
   */
  isAlive() {
    return this.myClient.connected;
  }

  /**
   * Get the value of a key from Redis.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string>} The value of the key.
   */
  async get(key) {
    const getAsync = promisify(this.myClient.GET).bind(this.myClient);
    return getAsync(key);
  }

  /**
   * Set a key-value pair in Redis with an expiration time.
   * @param {string} key - The key to set.
   * @param {string} val - The value to set.
   * @param {number} time - The expiration time in seconds.
   * @returns {Promise<string>} The result of the set operation.
   */
  async set(key, val, time) {
    const setAsync = promisify(this.myClient.SET).bind(this.myClient);
    return setAsync(key, val, 'EX', time);
  }

  /**
   * Delete a key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<number>} The number of keys that were removed.
   */
  async del(key) {
    const delAsync = promisify(this.myClient.DEL).bind(this.myClient);
    return delAsync(key);
  }
}

/**
 * An instance of the RedisClient.
 * @type {RedisClient}
 */
const redisClient = new RedisClient();

export default redisClient;
