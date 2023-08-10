const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const handleTwitterLinks = require('./helpers/embedTwitterHandler');
const handleBotMention = require('./helpers/chatBotHandler');
const keepAlive = require("./server");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.loggers = new Map();
const loggerFiles = fs.readdirSync('./loggers').filter(file => file.endsWith('.js'));

for (const file of loggerFiles) {
  const logger = require(`./loggers/${file}`);
  client.loggers.set(logger.name, logger);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  console.log(message.content);

  if (message.content.startsWith('!')) {
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to execute that command!');
    }
  } else if (message.mentions.users.has(client.user.id)) {
    await handleBotMention(message, client);
  } else {
    await handleTwitterLinks(message);
  }
});

const eventLoggerMap = {
  'guildMemberAdd': 'logMemberJoined',
  'guildMemberRemove': 'logMemberLeft',
  'messageDelete': 'logMemberDelMsg',
  'messageUpdate': 'logMemberEditMsg',
  'logFateSus' : 'logFateAmogus'
  // add more if needed
};

for (const [eventName, loggerName] of Object.entries(eventLoggerMap)) {
  client.on(eventName, (...args) => {
    console.log(`${eventName} event triggered`); 
    if (client.loggers.has(loggerName)) {
      client.loggers.get(loggerName).execute(...args);
    }
  });
}

keepAlive();
client.login(process.env['discToken']);
