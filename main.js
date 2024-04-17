const {  Keys, EventBuilder, EventId, PublicKey, Tag, loadWasmSync, Timestamp, ClientMessage, Metadata, loadWasmAsync} = require("@rust-nostr/nostr");
const {Client, NostrSigner} = require("@rust-nostr/nostr-sdk");

async function main() {
    // Load WASM 
    // if you are in a non async context, use loadWasmSync()
    await loadWasmAsync();

    // Generate random keys
    let keys = Keys.generate();

    // Hex keys
    console.log("Public key (hex): ", keys.publicKey.toHex());
    console.log("Secret key (hex): ", keys.secretKey.toHex());

    // Bech32 keys
    console.log("Public key (bech32): ", keys.publicKey.toBech32());
    console.log("Secret key (bech32): ", keys.secretKey.toBech32());

    let event = new EventBuilder(1, "Testing nostr JS bindings", [Tag.parse(["p", "d0a59cd44b6051708e9d437aa01f86451378a130ea7ba38ad43eae0bd0e0c4ce"])]).toEvent(keys);
    console.log(event.asJson()); // Print event as JSON
    console.log(event.tags[0].toVec()); // Print first tag

    // Custom created at
    let customTimestamp = Timestamp.fromSecs(12345);
    let e = EventBuilder.textNote("Event with custom timestamp", []).customCreatedAt(customTimestamp).toEvent(keys);
    console.log(e.asJson());

    let signer = NostrSigner.keys(keys);
    let client = new Client(signer);
    await client.addRelay("wss://relay.damus.io");
    await client.connect();
    let metadata = new Metadata()
        .name("username")
        .displayName("My Username")
        .about("Description")
        .picture("https://example.com/avatar.png")
        .banner("https://example.com/banner.png")
        .nip05("username@example.com")
        .lud16("yuki@getalby.com");
    
    await client.setMetadata(metadata);

    // Publish text note
    await client.publishTextNote("My first text note from Nostr SDK!", []);

}

main();

