const { GuildMember } = require('discord.js');

async function logMemberLeft(member) {
    const { guild, user } = member;
    const logChannel = guild.channels.cache.find(ch => ch.name === 'logs');
    const generalChannel = guild.channels.cache.find(ch => ch.name === 'general');

    if (!logChannel || !generalChannel) {
        console.error('Log or general channel not found');
        return;
    }

    logChannel.send(`Member left: ${user} (Tag: ${user.tag}) (ID: ${user.id})`);
    generalChannel.send(`We're sorry to see you leave, ${user}!`);
}

module.exports = {
  name: 'logMemberLeft',
  execute: logMemberLeft
};
