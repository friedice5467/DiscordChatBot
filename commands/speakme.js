module.exports = {
    name: 'speakme',
    description: 'Speak command',
    async execute(message, args) {
        let botResponse = args.join(' ');
        await message.delete();
        message.channel.send(botResponse);
    },
};
