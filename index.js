const keepAlive = require("./server")
const fetch = require('node-fetch');
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.MessageContent
    ]
})

API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", async (message) => {

    if (message.author.bot) {
        return;
    }
      
    if(message.channel.name != 'bot-channel')
    {
      return;
    }
  console.log(message.content);
  
    const payload = {
        inputs: {
            text: message.content
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
    let botResponse = '';
    if (data.hasOwnProperty('generated_text')) {
        botResponse = data.generated_text;
    } else if (data.hasOwnProperty('error')) { // error condition
        botResponse = data.error;
    }
    // stop typing
    message.channel.sendTyping();
    // send message to channel as a reply
    message.reply(botResponse);
});

keepAlive()
client.login(process.env['discToken'])