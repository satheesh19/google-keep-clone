import { FolderI } from './../interfaces/folders';
import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from '../db/db'
@Injectable({
  providedIn: 'root'
})
export class FoldersService {

  constructor() { }

  foldersList$ = liveQuery(() => db.folders.toArray())

  async add(folderObj: FolderI) {
    try {
      console.log('FoldersService.add called', folderObj)
      return await db.folders.add(folderObj)
    } catch (err) {
      console.error('FoldersService.add error', err)
      throw err
    }
  }

  delete(id: number) {
    try {
      db.folders.delete(id)
    } catch (error) {
      console.log(error)
    }
  }

  update(object: FolderI, id: number) {
    if (id !== -1) {
      try {
        db.folders.update(id, object)
      } catch (error) {
        console.log(error)
      }
    }
  }


}

