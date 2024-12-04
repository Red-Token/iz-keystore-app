import {NostrConnectUrl} from "./ae/redtoken/iz-keystore/NostrConnectUrl.ts";
import {IZKeyStore} from "./ae/redtoken/iz-keystore/IZKeyStore.ts";
import {normalizeRelayUrl} from "@welshman/util";

export class TestClass {
    constructor(public name: string) {
        console.log("TestClasddddd");
    }
    async xxxxeee(ncurl: string) {
        const nc = new NostrConnectUrl(ncurl);
        console.log(nc);

        const nsecAlice = 'nsec1vaqeqr4xhrrh64v20lsjuvpep8vq4hn0jf8x0mzqxnwz6tyy0wnqrvjxs6';
        // export const npubAlice = 'npub12rluy7gqjhgjyelgzhglc2vg4hgvrtsvvf94ut9za050rgx7ekgswhu79w'
        const keyStore = new IZKeyStore(nsecAlice, [nc.getParam('relay')!]);
        await keyStore.connect({relay: nc.getParam('relay')!, npub: nc.getPublicKey(), secret: nc.getParam('secret')!},);

        console.log('CARAMBA!');
    }
}
