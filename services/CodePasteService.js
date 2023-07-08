const fetch = require('node-fetch');

class CodePasteService {
  static async uploadCode(message, code) {
    try {
      const formattedCode = `
      /*
        Written By: ${message.author.username}#${message.author.discriminator} in #${message.channel.name}
        Posted on: ${new Date().toUTCString()}
        Message ID: ${message.id}
      */
      ${code}`;

      const response = await fetch('https://paste.mod.gg/documents', {
        method: 'POST',
        body: formattedCode,
        headers: { 'Content-Type': 'text/plain' },
      });

      if (response.ok) {
        const data = await response.json();
        return `https://paste.mod.gg/${data.key}`;
      } else {
        const errorText = await response.text();
        throw new Error(`${response.status} returned when calling ${response.url}. Response body: ${errorText}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CodePasteService;
