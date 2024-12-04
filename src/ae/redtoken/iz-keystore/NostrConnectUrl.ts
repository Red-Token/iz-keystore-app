export class NostrConnectUrl {
    private url: URL

    constructor(url: string) {
        this.url = new URL(url)
    }

    getPublicKey() {
        return this.url.hostname
    }

    getParam(param: string) {
        return this.url.searchParams.get(param)
    }
}
