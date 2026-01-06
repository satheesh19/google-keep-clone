import { FolderI } from '../interfaces/folders';
import Dexie, { Table } from 'dexie';
import { NoteI } from '../interfaces/notes';

class AppDB extends Dexie {
    notes!: Table<NoteI, number>
    folders!: Table<FolderI, number>
    constructor() {
        super('brihoum_gk');
        // Bump DB version so Dexie will apply the new schema.
        // If an existing DB had a `labels` store, migrate its data into `folders`.
        this.version(3).stores({ notes: "++id", folders: "++id,&name" }).upgrade(async () => {
            try {
                // If an old `labels` store exists, copy its rows into `folders`.
                if ((this as any).tables.some((t: any) => t.name === 'labels')) {
                    const old = await (this as any).table('labels').toArray();
                    if (old && old.length) {
                        // Map to folder shape (id will be auto-assigned if duplicated)
                        const toAdd = old.map((r: any) => ({ name: r.name, added: r.added }));
                        await this.table('folders').bulkAdd(toAdd)
                    }
                }
            } catch (err) {
                console.error('DB migration (labels -> folders) failed', err)
            }
        })
    }
}

export const db = new AppDB()