const { Client, ClientBuilder, NostrSigner, Keys, Nip07Signer, Metadata, ZapDetails, ZapEntity, ZapType, PublicKey, loadWasmAsync } = require("@rust-nostr/nostr-sdk");

async function main() {
    // Load WASM
    // if you are in a non async context, use loadWasmSync()
    await loadWasmAsync();

    // Compose client with private key
    let keys = Keys.generate(); // Random keys
    console.log("Public key (hex): ", keys.publicKey.toHex());
    console.log("Secret key (hex): ",keys.secretKey.toHex());
    console.log("Public key (bech32): ", keys.publicKey.toBech32());
    console.log("Secret key (bech32): ", keys.secretKey.toBech32());
    let signer = NostrSigner.keys(keys);
    let client = new Client(signer);


    // Add relays
    await client.addRelay("wss://relay.damus.io");

    // Add multiple relays at once
    await client.addRelays([
        "wss://nostr.oxtr.dev",
        "wss://relay.nostr.band",
    ]);

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