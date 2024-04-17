const {
    Client,
    NostrSigner,
    Keys,
    loadWasmAsync,
    Filter
} = require("@rust-nostr/nostr-sdk");

async function main() {
    // Load WASM
    // if you are in a non async context, use loadWasmSync()
    await loadWasmAsync();

    let key = Keys.generate();
    console.log("Public key (hex): ", key.publicKey.toHex());
    console.log("Secret key (hex): ", key.secretKey.toHex());
    console.log("Public key (bech32): ", key.publicKey.toBech32());
    console.log("Secret key (bech32): ", key.secretKey.toBech32());
    let signer = NostrSigner.keys(key);
    let client = new Client(signer);
    await client.addRelay("wss://nostr.oxtr.dev");
    await client.addRelay("wss://relay.damus.io");
    await client.connect();
    const filter = new Filter().author(key.publicKey).kind(1);
    console.log('Filter:', filter.asJson());
    let subid = await client.subscribe([filter]);
    console.log("Subscribed with id: ", subid);
    const handle = {
        // Handle event
        handleEvent: async (relayUrl, subscriptionId, event) => {
            console.log("Received new event from", relayUrl);
            if (event.kind == 4) {
                try {
                    let content = nip04Decrypt(keys.secretKey, event.author, event.content);
                    console.log("Message:", content);
                    await client.sendDirectMsg(event.author, "Echo: " + content);
                    if (content == "stop") {
                        return true;
                    }
                } catch (error) {
                    console.log("Impossible to decrypt DM:", error);
                }
            }
        }, // Handle relay message
        handleMsg: async (relayUrl, message) => {
            console.log("Received message from", relayUrl, message.asJson());
        }
    };
    console.log("Handle:", handle);
    client.handleNotifications(handle);
}

main();