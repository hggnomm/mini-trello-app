import path from 'path';
import { Firestore } from '@google-cloud/firestore';
import { logger } from '../../utils/logger';

const db = new Firestore({
  projectId: 'mini-trello-app-d5f1c',
  keyFilename: path.resolve(__dirname, '../../../keyfile.json'),
});

export const getDb = () => {
  return db;
};

export const checkConnection = async () =>  {
  try {
    await db.collection('users').get();
    logger.info("Connected to Firestore");
    return "Connected";
  } catch (error) {
    logger.error(error, "Error connecting to Firestore");
    return "Disconnect, error: " + error;
  }
}