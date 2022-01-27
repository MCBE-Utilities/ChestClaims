import { EventEmitter } from 'beapi-core'
import { db, chestCollection } from './database/index.js'
import { listeners } from './listeners/index.js'

export class ChestClaims extends EventEmitter {
  public readonly database = db
  public readonly chestCollection = chestCollection
  public readonly listener = new listeners(this)
}

export const chestclaims = new ChestClaims()
