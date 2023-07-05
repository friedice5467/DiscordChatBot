module.exports = {
    name: 'help',
    description: 'Help command',
    async execute(message, args) {
        let botResponse = "Help yourself noob";
        message.channel.send(botResponse);
    },
};
