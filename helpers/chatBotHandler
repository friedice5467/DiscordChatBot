const fetch = require('node-fetch');
const API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-1B-distill';

async function handleBotMention(message, client) {
  let messageContent = message.content.replace(`<@${client.user.id}>`, "").trim();

  if (messageContent !== '') {
    const payload = {
      inputs: {
        text: messageContent
      }
    };

    const headers = {
      "Authorization": process.env['aiToken']
    };

    message.channel.sendTyping();

    const response = await fetch(API_URL, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: headers
    });

    const data = await response.json();

    console.log(data);

    if (data.hasOwnProperty('generated_text')) {
      message.channel.send(data.generated_text);
    } else if (data.hasOwnProperty('error')) {
      message.channel.send(data.error);
    }
  }
}

module.exports = handleBotMention;
