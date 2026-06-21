import { getDb } from "../libs/firebase/firebase";

// https://omacy.medium.com/implementing-the-repository-design-pattern-in-node-js-express-a-complete-guide-354cfadc22a0

export class BaseRepository {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollection() {
    return getDb().collection(this.collectionName);
  }

  async create(data: any): Promise<any> {
    const docRef = this.getCollection().doc();
    const now = new Date().toISOString()

    const newItem = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await docRef.set(newItem);
    return newItem;
  }

  async findById(id: string): Promise<any> {
    const doc = await this.getCollection().doc(id).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  async findAll(): Promise<any[]> {
    const snapshot = await this.getCollection().get();

    const items: any[] = [];

    snapshot.forEach((doc) => {
      items.push(doc.data());
    });

    return items;
  }

  async update(id: string, data: any) {
    const now = new Date().toISOString()
    const updateData = {
      ...data,
      updatedAt: now,
    };

    await this.getCollection().doc(id).update(updateData);
  }

  async delete(id: string) {
    await this.getCollection().doc(id).delete();
  }
}
