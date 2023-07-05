const { Message } = require('discord.js');

async function logMessageUpdate(oldMessage, newMessage) {
    if (oldMessage.content === newMessage.content) {
        return; // Message update was not a content change (could be embed update, etc.)
    }

    const { guild, author, content } = oldMessage;
  
    const logChannel = guild.channels.cache.find(ch => ch.name === 'logs');

    if (!logChannel) {
        console.error('Log channel not found');
        return;
    }

    logChannel.send(`Message edited by ${author.tag} (ID: ${author.id}): \nBefore: ${oldMessage.content} \nAfter: ${newMessage.content}`);
}

module.exports = {
  name: 'logMemberEditMsg',
  execute: logMessageUpdate
};
