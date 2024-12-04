import {nip19} from "nostr-tools";
import {string} from "yargs";

export function decodeNPub(npub: string): string {
    const decodedResult = nip19.decode(npub)

    if (decodedResult.type !== 'npub') throw new Error("No not an npub");

    return decodedResult.data
}

export function decodeNSec(nsec: string | undefined): Uint8Array {
    if (nsec === undefined) throw new Error("Undefined is not an nsec");

    const res = nip19.decode(nsec)

    if (res.type !== 'nsec') throw new Error("Not an nsec");

    return res.data
}

export function decodeSecretKey(data: Uint8Array | string): Uint8Array {
    return (typeof data === 'string') ? decodeNSec(data) : data
}

export function decodePublicKey(data: string) {
    return (data.startsWith('npub') ? decodeNPub(data) : data)
}

