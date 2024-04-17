const {
    Client,
    NostrSigner,
    Keys,
    loadWasmAsync,
    Filter
} = require("@rust-nostr/nostr-sdk");

async function main() {
    // Load WASM
    await loadWasmAsync();

    const clients = [];
    const numKeys = 100; // Number of keys and clients to handle

    for (let i = 0; i < numKeys; i++) {
        let key = Keys.generate();
        console.log(`Client ${i} Public key (hex): `, key.publicKey.toHex());
        console.log(`Client ${i} Secret key (hex): `, key.secretKey.toHex());

        let signer = NostrSigner.keys(key);
        let client = new Client(signer);

        await client.addRelay("wss://nostr.oxtr.dev");
        await client.addRelay("wss://relay.damus.io");
        await client.connect();

        const filter = new Filter().author(key.publicKey).kind(1);
        let subid = await client.subscribe([filter]);
        console.log(`Client ${i} Subscribed with id: `, subid);

        clients.push({ client, key }); // Store both client and key for further use
    }

    // Define a general event handler
    const handleEvent = async (relayUrl, subscriptionId, event) => {
        console.log("Received new event from", relayUrl, "Subscription ID:", subscriptionId);
        // Here, handle events as needed. Assuming decrypt and response:
        if (event.kind === 4) { // Assuming kind 4 is a direct message
            let clientIndex = clients.findIndex(c => c.key.publicKey.toHex() === event.author.toHex());
            if (clientIndex !== -1) {
                try {
                    let content = nip04Decrypt(clients[clientIndex].key.secretKey, event.author, event.content);
                    console.log("Decrypted Message:", content);
                    await clients[clientIndex].client.sendDirectMsg(event.author, "Echo: " + content);
                } catch (error) {
                    console.log("Error decrypting message:", error);
                }
            }
        }
    };

    // Define a message handler
    const handleMsg = async (relayUrl, message) => {
        console.log("Received message from", relayUrl, ": ", message.asJson());
    };

    // Register event and message handlers for each client
    clients.forEach(({ client }) => {
        client.handleNotifications({
            handleEvent: handleEvent,
            handleMsg: handleMsg
        });
    });
}

main();
