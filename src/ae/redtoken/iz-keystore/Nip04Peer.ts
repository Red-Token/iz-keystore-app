import {nip04} from "nostr-tools";
import {NOSTR_CONNECT} from "@welshman/util";

export class Nip04Peer {

    constructor(private secretKey: Uint8Array, private peerPub: string) {
    }

    async decryptMessage(encMsg: string) {
        return JSON.parse(await nip04.decrypt(this.secretKey, this.peerPub, encMsg))
    }

    // Creates a payload to be sent
    async encryptMessage(msg: string) {
        return await nip04.encrypt(this.secretKey, this.peerPub, msg)
    }

    createPayload(encMsg: string) {
        return {content: encMsg, tags: [['p', this.peerPub]]}
        // return {content: JSON.stringify(encMsg), tags: [['p', this.peerPub]]}
    }
}
