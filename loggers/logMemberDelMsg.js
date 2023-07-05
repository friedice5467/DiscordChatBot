const { Message } = require('discord.js');

async function logMessageDelete(message) {
    const { guild, author, content } = message;

    if(message.content.includes("speakme")) return;
  
    const logChannel = guild.channels.cache.find(ch => ch.name === 'logs');

    if (!logChannel) {
        console.error('Log channel not found');
        return;
    }

    logChannel.send(`Message deleted by ${author.tag} (ID: ${author.id}): ${content}`);
}

module.exports = {
  name: 'logMemberDelMsg',
  execute: logMessageDelete
};
