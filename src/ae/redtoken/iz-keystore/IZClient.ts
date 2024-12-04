import {setContext} from "@welshman/lib";
import {getDefaultAppContext, getDefaultNetContext} from "@welshman/app";
import {Nip46ClientSession} from "./Nip46ClientSession";
import {secret} from "../../../../test/scenario-test/scenario-1/config";

type InData = {
    relay: string,
    npub: string
}

export class IZClient {

    constructor() {
    }

    async handler(relay: string, nsec: string) {
        setContext({
            net: getDefaultNetContext(),
            app: getDefaultAppContext()
        })

        const ks = await new Nip46ClientSession(nsec,[relay],secret).init()

        ks.emitter.on("stateChange", async (state) => {
            console.log(state)

            const response =  await ks.sendRequest({id:'1', method: 'ping', params: []})
            console.log(response)


            ks.sendRequest({id:'2', method: 'sign_event', params: []})

        })


        // const sessionSecretKey = decodeNSec(nsec)
        // const sessionPublicKey = getPublicKey(sessionSecretKey)
        // const sessionNSec = nip19.nsecEncode(sessionSecretKey)
        // const sessionNPub = nip19.npubEncode(sessionPublicKey)
        //
        // const url = relay
        // const keyRelays = [normalizeRelayUrl(url)]
        //
        // const keySession = await new SynchronisedSession({type: SignerType.NIP01, nsec: sessionNSec}, keyRelays).init()
        //
        // const sub = keySession.createSubscription([
        //     {kinds: [NOSTR_CONNECT], '#p': [sessionPublicKey], since: now()}
        // ])
        //
        // const publisher = keySession.createPublisher()
        //
        // keySession.eventStream.emitter.on(EventType.DISCOVERED, async (event: TrustedEvent) => {
        //
        //     const encMsg = JSON.parse(event.content)
        //     // Decode the event
        //     const json = await nip04.decrypt(sessionSecretKey, event.pubkey, encMsg)
        //
        //     const msg = JSON.parse(json)
        //
        //     console.log(msg)
        //
        //     // Lets handle the reply
        //     {
        //         const msg = JSON.stringify('Hi boss, I am on the mike!')
        //         const peerPub = event.pubkey
        //         const encMsg = await nip04.encrypt(sessionSecretKey, peerPub, msg)
        //         const payload = {content: JSON.stringify(encMsg), tags: [['p', peerPub]]}
        //         const publishResult = await publisher.publish(NOSTR_CONNECT, payload).result
        //     }
        // })
    }
}
