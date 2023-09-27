const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'getprofile',
  description: 'Get user profile',
  async execute(message, args) {

    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);
    const joinDateTime = new Date(member.joinedTimestamp);
const joinDate = joinDateTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});
const joinTime = joinDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
});
const formattedJoin = `${joinDate} at ${joinTime}`;
    
    const profileEmbed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle(`${user.username}'s Profile`)
      .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
      .addFields({ name: 'Join Date', value: formattedJoin },
    {
			name: 'Avatar',
			value: '\u200b',
      inline: false
		});

    return message.channel.send({ embeds: [profileEmbed] });
  },
};
