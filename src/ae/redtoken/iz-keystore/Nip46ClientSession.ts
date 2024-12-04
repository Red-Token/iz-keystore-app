import {Nip46Request, Nip46Response, Nip46Session, PeerHandler, PeerHandlerEventType} from "./Nip46Session";
import {Nip04Peer} from "./Nip04Peer";
import {TrustedEvent} from "@welshman/util";
import {Nip46PeerPublisher} from "./Nip46PeerPublisher";
import EventEmitter from "node:events";

export class Nip46ClientSession extends Nip46Session {
    protected publisher: Nip46PeerPublisher | undefined;
    private requestMap: Map<string, any> = new Map()

    constructor(nsec: string, public readonly relays: string[], private secret: string) {
        super(nsec, relays);

        // this.emitter.on(Nip46SessionEventType.PEER_DISCOVERED,(peerHandler) => {
        //     peerHandler.emitter.on(PeerHandlerEventType.MESSAGE, ())
        //
        //     peerHandler.publisher.publishConnectMessage()
        // })
    }

    processResponse(response: Nip46Response) {
        if (!this.requestMap.has(response.id))
            return

        //TODO: make this more stateful?
        this.requestMap.get(response.id).resolve(response);
    }

    public emitter = new EventEmitter();

    async init() {
        return await super.init();
    }

    createPeerHandler(peer: Nip04Peer): PeerHandler {
        const peerHandler = super.createPeerHandler(peer);

        const onMessage = (response: Nip46Response, event: TrustedEvent) => {
            // if we already have a publisher or of the peer don't know the secret then we ignore him
            if (this.publisher !== undefined && response.result !== this.secret) return

            // This is a bit of a hack but should work, if the remote-signer knows the secret then we assign the
            // publisher, deregister us and register the processResponse
            // TODO: We have some Hudini stuff here
            this.publisher = peerHandler.publisher
            peerHandler.emitter.off(PeerHandlerEventType.MESSAGE, onMessage)
            peerHandler.emitter.on(PeerHandlerEventType.MESSAGE, this.processResponse.bind(this))
            this.emitter.emit('stateChange', 'Connected')
        }

        peerHandler.emitter.on(PeerHandlerEventType.MESSAGE, onMessage)

        return peerHandler
    }

    async sendRequest(request: Nip46Request) {
        const promise = new Promise((resolve, reject) => {
            this.requestMap.set(request.id, {resolve, reject})
        })

        await this.publisher?.publishConnectMessage(request)

        return promise
    }

    seq = 0

    async ping() {
        return this.sendRequest({id: `${this.seq++}`, method: 'ping', params: []})
    }

    async signEvent(event: any) {
        return this.sendRequest({id: `${this.seq++}`, method: 'sign_event', params: [JSON.stringify(event)]})
    }
}
