import { client, ItemInteractEvent, Player } from 'beapi-core'
import { ChestClaims } from '../index.js'

export class listeners {
    private claims: ChestClaims

    constructor(claims: ChestClaims) {
        this.claims = claims
        client.on("ItemInteract", this.logic)
    }

    private logic(data: ItemInteractEvent): void {
        if (data.block.id !== "minecraft:chest") return
        const player = data.source as Player
        if (player.getIPlayer().isSneaking) {
            this.claim(data)
        } else {
            this.open(data)
        }
    }
    private claim(data: ItemInteractEvent): void {
        console.log("claim")
    }
    private open(data: ItemInteractEvent): void {
        console.log("open")
        const player = data.source as Player
        const chests = this.claims.chestCollection.values()
        const chest =  chests.find((x) => x.location === {
            x: data.blockLocation.x,
            y: data.blockLocation.y,
            z: data.blockLocation.z,
        })
        if (chest.owner !== player.getName() || !chest.trusted.includes(player.getName())) {
            this.claims.emit("ChestOpenRejected", chest)

            return data.cancel()
        }
    }
}