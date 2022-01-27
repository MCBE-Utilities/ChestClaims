import { Database } from 'beapi-core'
import { Chest } from './models/Chest.js'

export const db = new Database("chestclaims")

export const chestCollection = db.mount<string, Chest>("chests")
