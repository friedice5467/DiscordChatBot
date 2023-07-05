module.exports = {
    name: 'summon',
    description: 'Summon command',
    async execute(message, args) {
        let botResponse = "<:hmmcouncil1:1108159415632281602><:hmmcouncil2:1108159413598044190><:hmmcouncil3:1108159412285231155><:hmmcouncil4:1108159410343264257><:hmmcouncil5:1108159408694894653>";
        message.channel.send(botResponse);
    },
};
