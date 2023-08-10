const { Message } = require('discord.js');

async function logFateSus(message) {
    const { guild, author, content } = message;

    if (author.id !== '738558129469653023') return;

    const genChannel = guild.channels.cache.find(ch => ch.name === 'general');

    if (!genChannel) {
        console.error('general channel not found');
        return;
    }

const keyword = "facial"; 
const regex = new RegExp(`\\b${keyword}(s)?\\b`, "i");

if (content.match(regex)) {
  message.reply("<@738558129469653023> <:susge:1133515779233562724>");
}

}

module.exports = {
    name: 'logFateAmogus',
    execute: logFateSus,
};
