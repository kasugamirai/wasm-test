const { Client, ClientBuilder, NostrSigner, Keys, Nip07Signer, Metadata, PublicKey, loadWasmAsync, RelayMessage
,NostrDatabase, } = require("@rust-nostr/nostr-sdk");
const {EventId, EventBuilder} = require("@rust-nostr/nostr-sdk");

async function main() {
    // Load WASM
    await loadWasmAsync();
    let keys = Keys.generate();
    let metadata = new Metadata()
        .name("username")
        .displayName("My Username")
        .about("Description")
        .picture("https://example.com/avatar.png")
        .banner("https://example.com/banner.png")
        .nip05("username@example.com")
        .lud16("yuki@getalby.com");
    let event = EventBuilder.metadata(metadata).toEvent(keys);

    try {
        let db = await NostrDatabase.indexeddb("nostr");
        db.save_event(event);
    } catch (error) {
        console.error("Error initializing Nostr database:", error);
    }
}

main();
