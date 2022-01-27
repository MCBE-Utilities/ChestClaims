import { EventEmitter, Awaitable } from 'beapi-core'
import { db, chestCollection } from './database/index.js'
import { listeners } from './listeners/index.js'
import { ChestEvents } from './types/ChestEvents.js'

export interface ChestClaims {
  on<K extends keyof ChestEvents>(event: K, listener: (...args: ChestEvents[K]) => Awaitable<void>): void
  on<S extends string | symbol>(
    event: Exclude<S, keyof ChestEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  addListener<K extends keyof ChestEvents>(event: K, listener: (...args: ChestEvents[K]) => Awaitable<void>): void
  addListener<S extends string | symbol>(
    event: Exclude<S, keyof ChestEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  once<K extends keyof ChestEvents>(event: K, listener: (...args: ChestEvents[K]) => Awaitable<void>): this
  once<S extends string | symbol>(
    event: Exclude<S, keyof ChestEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  emit<K extends keyof ChestEvents>(event: K, ...args: ChestEvents[K]): void
  emit<S extends string | symbol>(event: Exclude<S, keyof ChestEvents>, ...args: unknown[]): void

  envokeEvent<K extends keyof ChestEvents>(event: K, ...args: ChestEvents[K]): void
  envokeEvent<S extends string | symbol>(event: Exclude<S, keyof ChestEvents>, ...args: unknown[]): void

  off<K extends keyof ChestEvents>(event: K, listener: (...args: ChestEvents[K]) => Awaitable<void>): void
  off<S extends string | symbol>(
    event: Exclude<S, keyof ChestEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  removeListener<K extends keyof ChestEvents>(event: K, listener: (...args: ChestEvents[K]) => Awaitable<void>): void
  removeListener<S extends string | symbol>(
    event: Exclude<S, keyof ChestEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  removeListeners<K extends keyof ChestEvents>(event?: K): void
  removeListeners<S extends string | symbol>(event?: Exclude<S, keyof ChestEvents>): void
}

export class ChestClaims extends EventEmitter {
  public readonly database = db
  public readonly chestCollection = chestCollection
  public readonly listener = new listeners(this)
  public staffTag = "admin"
}

export const chestclaims = new ChestClaims()
