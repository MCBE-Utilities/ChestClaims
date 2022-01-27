import { Location, Player } from 'beapi-core'
import { Chest } from '../database/models/Chest.js'

export interface ChestEvents {
  ChestClaimRemoved: [ChestClaimRemoved]
  ChestClaimRejected: [ChestClaimRejected]
  ChestClaimed: [ChestClaimed]
  ChestOpenRejected: [ChestOpenRejected]
}

interface ChestClaimRemoved {
  chest: Chest
  player: Player
  cancel: () => void
}

interface ChestClaimRejected {
  chest: Chest
  player: Player
  reason: string
  cancel: () => void
}

interface ChestClaimed {
  location: Location
  player: Player
  cancel: () => void
}

interface ChestOpenRejected {
  chest: Chest
  player: Player
  reason: string
  cancel: () => void
}