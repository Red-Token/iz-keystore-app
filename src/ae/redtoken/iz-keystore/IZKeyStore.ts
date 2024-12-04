import {setContext} from "@welshman/lib";
import {getDefaultAppContext, getDefaultNetContext} from "@welshman/app";
import {generateSecretKey, getPublicKey, nip19} from "nostr-tools";
import {decodeNPub, decodeNSec, decodePublicKey, decodeSecretKey} from "./util";
import {Nip46RemoteSignerSession} from "./Nip46RemoteSignerSession";
import {string} from "yargs";
import {ISigner, Nip01Signer} from "@welshman/signer";
import {bytesToHex} from "@noble/hashes/utils";

type InData = {
    relay: string,
    npub: string,
    secret: string
}

class KeyStore {
    private secretKey: Uint8Array;
    private signer: ISigner;

    constructor(inSecretKey: Uint8Array | string) {
        this.secretKey = decodeSecretKey(inSecretKey)
        this.signer = Nip01Signer.fromSecret(bytesToHex(this.secretKey))
    }
}

export class IZKeyStore {
    private signer: Nip01Signer;

    constructor(secretKey: Uint8Array | string, private relays: string[]) {
        setContext({
            net: getDefaultNetContext(),
            app: getDefaultAppContext()
        })

        this.signer = Nip01Signer.fromSecret(bytesToHex(decodeSecretKey(secretKey)))
    }

    async connect(inData: InData) {

        const sessionSecretKey = generateSecretKey()
        const sessionNSec = nip19.nsecEncode(sessionSecretKey)

        console.log(sessionNSec)
        console.log(getPublicKey(sessionSecretKey))

        const keySession = await new Nip46RemoteSignerSession(this.signer, this.relays, sessionNSec, [inData.relay]).init()

        const res = await keySession.connect(decodePublicKey(inData.npub), inData.secret)

        console.log("XXXXXXXXTTTYU")
    }
}
