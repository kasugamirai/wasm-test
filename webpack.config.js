const path = require('path');

module.exports = {
  mode: 'development',
  entry: './node_modules/@rust-nostr/nostr-sdk/pkg/nostr_sdk_js.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'nostr-sdk-bundle.js',
    library: 'NostrSDK'
  },
  experiments: {
    asyncWebAssembly: true
  }
};
