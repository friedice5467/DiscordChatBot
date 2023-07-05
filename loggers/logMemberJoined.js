const { GuildMember } = require('discord.js');

const welcomeMessages = [
  'Glad to have you, {member}. <:peepositcomfy:1105344112523214899>',
  'Welcome, {member}! We hope you brought pizza. <a:bopDog:1126237214888693880>',
  'A wild {member} appeared. <:letsfuckingPoop:1124080362897817690>',
  'Enjoy your stay {member}! <a:catKiss:1124080134442451004>',
  'Glad to have you, {member}. <a:birb:1126237212678312030>',
  'Welcome, {member}! We hope you brought pizza. <a:quickKiss:1126237226653733055>',
  'Enjoy your stay {member}! <a:dancingBird:1126237221704433724>',
];

/**
 * Logs when a new member joins a guild and sends a welcome message.
 * @param {GuildMember} member The member that joined
 */
async function logMemberAdd(member, client) {
  const { guild, user } = member;
  const logChannel = guild.channels.cache.find(ch => ch.name === 'logs'); 

  if (!logChannel) {
    console.error('Log channel not found');
    return;
  }

  logChannel.send(`Member joined: ${user.tag} (ID: ${user.id})`);

  const welcomeChannel = guild.channels.cache.find(ch => ch.name === 'welcome'); 

  if (!welcomeChannel) {
    console.error('Welcome channel not found');
    return;
  }

  const randomWelcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)].replace('{member}', member.toString());

  welcomeChannel.send(randomWelcomeMessage);
}

module.exports = {
  name: 'logMemberJoined',
  execute: logMemberAdd
};
