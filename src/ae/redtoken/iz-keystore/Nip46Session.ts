import {EventType, SignerType, Subscription, SynchronisedSession} from "iz-nostrlib";
import {normalizeRelayUrl, NOSTR_CONNECT, TrustedEvent} from "@welshman/util";
import {Nip04Peer} from "./Nip04Peer";
import {getPublicKey} from "nostr-tools";
import {now} from "@welshman/lib";

import {Nip46PeerPublisher} from "./Nip46PeerPublisher";
import {decodeNSec} from "./util";
import EventEmitter from 'events';

export enum PeerHandlerEventType {
    MESSAGE = 'message'
}

export type Nip46Request = {
    id: string
    method: string
    params: string[]
}

export type Nip46Response = {
    id: string
    result: string
    error?: string
}


export class PeerHandler {
    public emitter = new EventEmitter

    constructor(private peer: Nip04Peer, public publisher: Nip46PeerPublisher) {
    }

    onEvent(event: TrustedEvent) {
        // this.peer.decryptMessage(JSON.parse(event.content)).then(decryptedContent =>
        this.peer.decryptMessage(event.content).then(decryptedContent =>
            this.emitter.emit(PeerHandlerEventType.MESSAGE, decryptedContent, this.publisher, event))
    }

    // processMsg(msg: any, event: TrustedEvent) {
    //     console.log(msg)
    //
    //     this.publisher.publishConnectMessage("I am on the mick").then((res) => {
    //         console.log(res)
    //     })
    // }
}

export class Nip04Session extends SynchronisedSession {
    protected sub: Subscription | undefined;
    protected peerMap = new Map<string, PeerHandler>();

}

export enum Nip46SessionEventType {
    PEER_DISCOVERED = "peer-discovered",
}

export class Nip46Session extends Nip04Session {

    constructor(nsec: string, public readonly relays: string[]) {
        super({
                type: SignerType.NIP01,
                // nsec: nip19.nsecEncode(generateSecretKey())
                nsec: nsec
            },
            relays.map((url) => normalizeRelayUrl(url)))
    }

    protected getSecretKey() {
        return decodeNSec(this.signerData.nsec)
    }

    protected getPublicKey() {
        return getPublicKey(this.getSecretKey())
    }

    createPeerPublisher(peer: Nip04Peer): Nip46PeerPublisher {
        return new Nip46PeerPublisher(peer, this)
    }

    createPeerHandler(peer: Nip04Peer) {
        return new PeerHandler(peer, new Nip46PeerPublisher(peer, this))
    }

    async init() {
        await super.init();

        this.eventStream.emitter.on(EventType.DISCOVERED, async (event: TrustedEvent) => {
            if (!this.peerMap.has(event.pubkey)) {
                const peer = new Nip04Peer(this.getSecretKey(), event.pubkey)
                const peerHandler = this.createPeerHandler(peer)
                this.peerMap.set(event.pubkey, peerHandler)
            }

            this.peerMap.get(event.pubkey)?.onEvent(event)
        })

        this.sub = this.createSubscription([
            {kinds: [NOSTR_CONNECT], '#p': [this.getPublicKey()], since: now()}
        ])

        return this
    }

}
