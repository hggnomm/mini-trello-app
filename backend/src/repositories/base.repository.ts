import { getDb } from '../libs/firebase/firebase';

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
        const now = new Date().toISOString();
        
        const newItem = {
            id: docRef.id,
            ...data,
            createdAt: now,
            updatedAt: now,
        };

        await docRef.set(newItem);
        return newItem;
    }

    async findById(id: string): Promise<any> {
        const doc = await this.getCollection().doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return doc.data();
    }

    async findAll(): Promise<any[]> {
        const snapshot = await this.getCollection().get();
        const items: any[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data) {
                items.push(data);
            }
        });
        return items;
    }

    async update(id: string, data: any): Promise<void> {
        const now = new Date().toISOString();
        const updateData = {
            ...data,
            updatedAt: now,
        };
        await this.getCollection().doc(id).update(updateData);
    }

    async delete(id: string): Promise<void> {
        await this.getCollection().doc(id).delete();
    }
}
