import { Location } from 'beapi-core'

export interface Chest {
    id: string
    owner: string
    trusted: string[]
    location: Location
}
