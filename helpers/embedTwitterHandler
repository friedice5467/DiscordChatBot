const twitterUrlRegex = /https:\/\/twitter\.com\/\S+/ig;

async function handleTwitterLinks(message) {
  if (twitterUrlRegex.test(message.content)) {
    let newMessageContent = message.content.replace(twitterUrlRegex, url => url.replace('twitter.com', 'vxtwitter.com'));
    await message.delete();
    message.channel.send(`${message.author} said, ${newMessageContent}`);
  }
}

module.exports = handleTwitterLinks;
