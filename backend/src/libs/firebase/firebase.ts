const path = require('path');
const Firestore = require('@google-cloud/firestore');

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
    console.log("Connected to Firestore");
    return "Connected";
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
    return "Disconnect, error: " + error;
  }
}