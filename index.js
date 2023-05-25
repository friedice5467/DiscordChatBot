const keepAlive = require("./server");
const { Client, GatewayIntentBits } = require('discord.js');
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
});

API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

client.on("ready", () => {
  console.log(` client user id is ${client.user.id}`);
  console.log(`Logged in as ${client.user.tag}!`);

  client.on("messageCreate", async (message) => {
    if (message.author.bot) {
      return;
    }

    console.log(message.content);

    let botResponse = '';

    const words = message.content.split(/\s+/);
    const commandWord = words.find(word => word.startsWith('!'));

    if (commandWord) {
      // the message contains a command, process it
      let command = commandWord.trim().substring(1).toLowerCase(); // Remove "!" prefix and convert to lower case

      switch (command) {
        case "summon":
          botResponse = "<:hmmcouncil1:1108159415632281602><:hmmcouncil2:1108159413598044190><:hmmcouncil3:1108159412285231155><:hmmcouncil4:1108159410343264257><:hmmcouncil5:1108159408694894653>";
          break;
        case "help":
          botResponse = "Help yourself noob";
          break;
        default:
          return;
      }
    }
    else if (message.mentions.users.has(client.user.id)) {
      // The bot was mentioned, but the message is not a command
      let messageContent = message.content.replace(`<@${client.user.id}>`, "").trim();
      if (messageContent !== '') {
        const fetch = require('node-fetch');
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

        if (data.hasOwnProperty('generated_text')) {
          botResponse = data.generated_text;
        } else if (data.hasOwnProperty('error')) { // error condition
          botResponse = data.error;
        }
      }
    } else {
      // The bot was not mentioned, and the message is not a command
      return;
    }

    message.channel.sendTyping();
    message.reply(botResponse);
  });
});

keepAlive();
client.login(process.env['discToken']);
