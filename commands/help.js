const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Help command',
    async execute(message, args) {
        const validTypes = ['!summon', '!getgym'];
        const helpEmbed = new EmbedBuilder()
                      .setColor('#0099FF')
                      .setTitle('Command List')
                      .setDescription(`\`\`\` ${validTypes.join('\n ')}\`\`\``);
                    return message.channel.send({ embeds: [helpEmbed] });
    },
};
