import {EventType, SignerType, Subscription, SynchronisedSession} from "iz-nostrlib";
import {generateSecretKey, getPublicKey} from "nostr-tools";
import {nsecEncode} from "nostr-tools/lib/types/nip19";
import {normalizeRelayUrl, NOSTR_CONNECT, TrustedEvent} from "@welshman/util";
import {now} from "@welshman/lib";
import {Nip04Peer} from "./Nip04Peer";

class PeerHandler {
    constructor(private peer: Nip04Peer) {
    }

    onEvent(event: TrustedEvent) {
        this.peer.decryptMessage(JSON.parse(event.content)).then(msg => this.processMsg(msg))
    }

    processMsg(msg: any) {
        console.log(msg)
    }
}

export class IZNip46Client {
    private readonly secretKey: Uint8Array;
    private session: SynchronisedSession | undefined;
    private sub: Subscription | undefined;
    private peerMap = new Map<string, PeerHandler>();

    constructor() {
        this.secretKey = generateSecretKey();
    }

    async init(urls: string[]) {
        this.session = await new SynchronisedSession(
            {
                type: SignerType.NIP01,
                nsec: nsecEncode(this.secretKey)
            },
            urls.map((url) => normalizeRelayUrl(url))
        ).init()

        this.session.eventStream.emitter.on(EventType.DISCOVERED, async (event: TrustedEvent) => {
            if(!this.peerMap.has(event.pubkey)) {
                this.peerMap.set(event.pubkey, new PeerHandler(new Nip04Peer(this.secretKey, event.pubkey)));
            }

            this.peerMap.get(event.pubkey)?.onEvent(event)
        })

        this.sub = this.session.createSubscription([
            {kinds: [NOSTR_CONNECT], '#p': [getPublicKey(this.secretKey)], since: now()}
        ])

        return this
    }
}
