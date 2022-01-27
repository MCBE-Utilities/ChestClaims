import { client, ItemInteractEvent, Player, genUuid, ClientBlockBreakEvent } from 'beapi-core'
import { ChestClaims } from '../index.js'

export class listeners {
    private claims: ChestClaims

    constructor(claims: ChestClaims) {
        this.claims = claims
        client.on("ItemInteract", (data) => this.logic(data))
        client.on("BlockDestroyed", (data) => this.break(data))
    }

    private logic(data: ItemInteractEvent): void {
        if (data.block.id !== "minecraft:chest") return
        const player = data.source as Player
        if (player.hasTag(this.claims.staffTag)) return
        if (player.getIPlayer().isSneaking) {
            this.claim(data)
        } else {
            this.open(data)
        }
    }
    private break(data: ClientBlockBreakEvent): void {
        if (data.player.hasTag(this.claims.staffTag)) return
        if (data.block !== "minecraft:chest") return
        const chests = this.claims.chestCollection.values()
        const location = {
            x: data.blockLocation.x,
            y: data.blockLocation.y,
            z: data.blockLocation.z,
        }
        const chest =  chests.find((x) => x.location.x === location.x && x.location.y === location.y && x.location.z === location.z)
        if (!chest) return
        if (chest.owner !== data.player.getName()) return data.cancel()
        let reject = false
        this.claims.emit("ChestClaimRemoved", {
            chest,
            player: data.player,
            cancel: () => {
                reject = true
            }
        })
        if (reject) return data.cancel()
        this.claims.chestCollection.delete(chest.id)
    }
    private claim(data: ItemInteractEvent): void {
        const player = data.source as Player
        const chests = this.claims.chestCollection.values()
        const location = {
            x: data.blockLocation.x,
            y: data.blockLocation.y,
            z: data.blockLocation.z,
        }
        const chest =  chests.find((x) => x.location.x === location.x && x.location.y === location.y && x.location.z === location.z)
        if (chest) {
            let reject = true
            this.claims.emit("ChestClaimRejected", {
                chest,
                player,
                reason: "already claimed",
                cancel: () => {
                    reject = false
                }
            })
            if (!reject) return
            if (chest.owner === player.getName()) {
                player.sendMessage("§cYou have already claimed this chest.")
            } else {
                player.sendMessage(`§cThis chest is already claimed by ${chest.owner}.`)
            }

            return data.cancel()
        } else {
            let reject = false
            const id = genUuid()
            this.claims.emit("ChestClaimed", {
                location,
                player,
                cancel: () => {
                    reject = true
                }
            })
            if (reject) return
            player.sendMessage("§aChest successfully claimed!")
            this.claims.chestCollection.set(id, {
                id,
                owner: player.getName(),
                location,
                trusted: [],
            }).save()

            return data.cancel()
        }
    }
    private open(data: ItemInteractEvent): void {
        const player = data.source as Player
        const chests = this.claims.chestCollection.values()
        const location = {
            x: data.blockLocation.x,
            y: data.blockLocation.y,
            z: data.blockLocation.z,
        }
        const chest =  chests.find((x) => x.location.x === location.x && x.location.y === location.y && x.location.z === location.z)
        if (!chest) return
        if (chest.owner !== player.getName() && !chest.trusted.includes(player.getName())) {
            let reject = true
            this.claims.emit("ChestOpenRejected", {
                chest,
                player,
                reason: "claimed chest",
                cancel: () => {
                    reject = false
                }
            })
            if (!reject) return

            return data.cancel()
        }
    }
}
