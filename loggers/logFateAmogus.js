const { Message, Collection } = require('discord.js');
const { stringSimilarity } = require("string-similarity-js");
const charMap = require('../consts/charMap');

const userMessagesCache = new Collection();

function normalize(str) {
  return Array.from(str).map(char => charMap[char.toLowerCase()] || char).join('').toLowerCase();
}

function isSimilarEnough(target, test) {
  return stringSimilarity(target, test) > 0.55;
}

async function logFateSus(message) {
  const { guild, author, content } = message;

  if (author.id !== '738558129469653023') return;

  console.log("Function for logging fate was hit.");

  const genChannel = guild.channels.cache.find(ch => ch.name === 'general');
  if (!genChannel) {
    console.error('general channel not found');
    return;
  }

  if (!userMessagesCache.has(author.id)) {
    userMessagesCache.set(author.id, []);
  }
  userMessagesCache.get(author.id).push(content);

  const combinedMessage = userMessagesCache.get(author.id).slice(-6).join(' ').replace(/\s+/g, '');
  const normalizedMessage = normalize(combinedMessage);

  if (isSimilarEnough("facial", normalizedMessage)) {
    message.reply("<@738558129469653023> <:susge:1133515779233562724>");
    message.reply("Why are you ghey?");
  }
}

async function handleEditedMessage(oldMessage, newMessage) {
  if (userMessagesCache.has(newMessage.author.id)) {
    const messages = userMessagesCache.get(newMessage.author.id);
    const idx = messages.indexOf(oldMessage.content);
    if (idx !== -1) {
      messages[idx] = newMessage.content;
    }
  }

  logFateSus(newMessage);
}

module.exports = {
    logFateSus,
    handleEditedMessage
};