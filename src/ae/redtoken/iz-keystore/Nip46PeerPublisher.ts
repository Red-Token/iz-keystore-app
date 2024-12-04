import {Nip04PeerPublisher} from "./Nip04PeerPublisher";
import {NOSTR_CONNECT} from "@welshman/util";

export class Nip46PeerPublisher extends Nip04PeerPublisher {
    async publishConnectMessage(msg: any) {
        return this.publishEncrypted(NOSTR_CONNECT, msg)
    }
}
