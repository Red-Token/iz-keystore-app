import {Nip46Request, Nip46Response, Nip46Session, PeerHandlerEventType} from "./Nip46Session";
import {Nip04Peer} from "./Nip04Peer";
import {Nip46PeerPublisher} from "./Nip46PeerPublisher";
import {ISigner, Nip01Signer} from "@welshman/signer";
import {signer} from "@welshman/app";

type requestHandler = (request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) => any

export class Nip46RemoteSignerSession extends Nip46Session {
    constructor(private userSigner: Nip01Signer, private userRelays: string[], nsec: string, public readonly relays: string[]) {
        super(nsec, relays);
    }

    async init() {
        return await super.init()
    }

    private requestHandlers: { [key: string]: requestHandler } = {
        connect: this.onConnectRequest.bind(this),
        ping: this.onPingRequest.bind(this),
        sign_event: this.onSignEventRequest.bind(this),
        get_relays: this.onGetRelaysRequest.bind(this),
        get_public_key: this.onGetPublicKeyRequest.bind(this),
        nip04_encrypt: this.onNip04EncryptRequest.bind(this),
        nip04_decrypt: this.onNip04DecryptRequest.bind(this),
        nip44_encrypt: this.onNip44EncryptRequest.bind(this),
        nip44_decrypt: this.onNip44DecryptRequest.bind(this),
    }

    async processRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        console.log(request)
        const func = this.requestHandlers[request.method]
        const res = await func(request, publisher, event)
        console.log(res)
    }

    protected async onConnectRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
    }

    protected async onPingRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        const msg = 'pong'
        const response: Nip46Response = {id: request.id, result: msg}
        return await publisher.publishConnectMessage(response)
    }

    protected async onSignEventRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        const msg = JSON.stringify(await this.userSigner.sign(JSON.parse(request.params[0])))
        const response: Nip46Response = {id: request.id, result: msg}
        return await publisher.publishConnectMessage(response)
    }

    protected async onGetRelaysRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        const msg = JSON.stringify(this.userRelays)
        const response: Nip46Response = {id: request.id, result: msg}
        return await publisher.publishConnectMessage(response)
    }

    protected async onGetPublicKeyRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        const msg = await this.userSigner.getPubkey()
        const response: Nip46Response = {id: request.id, result: msg}
        return await publisher.publishConnectMessage(response)
    }

    protected async onNip04EncryptRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        const msg = await this.userSigner.nip04.encrypt(request.params[0], request.params[1])
        const response: Nip46Response = {id: request.id, result: msg}
        return await publisher.publishConnectMessage(response)
    }

    protected async onNip04DecryptRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        const msg = await this.userSigner.nip04.decrypt(request.params[0], request.params[1])
        const response: Nip46Response = {id: request.id, result: msg}
        return await publisher.publishConnectMessage(response)
    }

    protected async onNip44EncryptRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        const msg = await this.userSigner.nip44.encrypt(request.params[0], request.params[1])
        const response: Nip46Response = {id: request.id, result: msg}
        return await publisher.publishConnectMessage(response)
    }

    protected async onNip44DecryptRequest(request: Nip46Request, publisher: Nip46PeerPublisher, event: TrackEvent) {
        const msg = await this.userSigner.nip44.decrypt(request.params[0], request.params[1])
        const response: Nip46Response = {id: request.id, result: msg}
        return await publisher.publishConnectMessage(response)
    }

    // TODO merge this to be able to do this the other way around
    async connect(peerPublicKey: string, secret: string) {
        // TODO: refactor this to a single connection session
        const peer = new Nip04Peer(this.getSecretKey(), peerPublicKey)
        const peerHandler = this.createPeerHandler(peer)
        peerHandler.emitter.on(PeerHandlerEventType.MESSAGE, this.processRequest.bind(this))
        this.peerMap.set(peerPublicKey, peerHandler)

        const msg = secret
        const response: Nip46Response = {id: '0', result: msg}
        const res = await peerHandler.publisher.publishConnectMessage(response)

        return res
    }
}
