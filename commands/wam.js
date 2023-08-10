module.exports = {
  name: 'wam',
  description: 'Wam user',
  async execute(message, args) {
    if (!message.mentions.users.size) {
      return message.channel.send('No user to wam.');
    }

    let botResponse = "User successfully wammed.";
    message.channel.send(botResponse);
  },
};