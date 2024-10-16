import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
    const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
    const db = process.env.DB_DATABASE || 'files_manager';
    const dbUrl = `mongodb://${host}:${port}`;
    this.client = new MongoClient(dbUrl, {
      useUnifiedTopology: true,
    });
    this.client
      .connect()
      .then((this.db = this.client.db(db)))
      .catch((error) => console.error(error));
  }

  isAlive() {
    return this.client.topology.isConnected();
  }

  async nbUsers() {
    const noUsers = await this.db.collection('users').countDocuments();
    return noUsers;
  }

  async nbFiles() {
    const noFiles = await this.db.collection('files').countDocuments();
    return noFiles;
  }
}

const dbClient = new DBClient();
export default dbClient;
