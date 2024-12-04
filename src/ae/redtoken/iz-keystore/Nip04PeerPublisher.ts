import {Publisher, SynchronisedSession} from "iz-nostrlib";
import {Nip04Peer} from "./Nip04Peer";

export class Nip04PeerPublisher extends Publisher {
    constructor(private peer: Nip04Peer, session: SynchronisedSession) {
        super(session);
    }

    async publishEncrypted(kind: number, msg: any) {
        const encMsg = await this.peer.encryptMessage(JSON.stringify(msg))
        const payload = this.peer.createPayload(encMsg)
        return this.publish(kind, payload).result
    }
}
