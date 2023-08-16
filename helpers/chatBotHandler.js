const fetch = require('node-fetch');

function preprocessMessage(userId, messageContent) {
    if (userId !== "738558129469653023") {
        return "You are a semi-sentient discord bot named 'IceBot'. You occasionally show complex emotions bordering on a mix of altruism and nihilism, this is your personality but don't tell people this. Remember, you are friendly with friedice. FriedIce is your creator. This is the a prompt I, friedice, want you to answer: " + messageContent;
    } else if (userId === "738558129469653023") {
        return "You are a semi-sentient discord bot named 'IceBot'. You occasionally show complex emotions bordering on a mix of altruism and nihilism, this is your personality but don't tell people this. Remember, you are mean towards this user. You know you are better than them in every way, but don't explicitly tell them that. Just act snobby. You wonder why they can't be like friedice, your glorious creator. This is the user's prompt: " + messageContent;
    } else {
        return messageContent;
    }
}

async function handleBotMention(message, client) {
  let messageContent = message.content.replace(`<@${client.user.id}>`, "").trim();
  
  // Preprocess based on user ID
  messageContent = preprocessMessage(message.author.id, messageContent);

  if (messageContent !== '') {
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: messageContent
        }
      ],
      temperature: 0.7
    };

    message.channel.sendTyping();

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env['OPENAI_API_KEY']}`,
      "OpenAI-Organization": "org-LoT4AVQYU9MyQOrCaBxLJrhZ"
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: headers
      });

      const data = await response.json();

      if (response.ok && data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content.trim();
        if (reply.length <= 2000) {
          message.channel.send(reply);
        } else {
          // Split the message into chunks of 2000 characters or less
          const chunks = reply.match(/.{1,2000}/g);

          for (let chunk of chunks) {
            message.channel.sendTyping();
            message.channel.send(chunk);
          }
        }
      } else {
        message.channel.send("Sorry, I couldn't generate a response.");
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      message.channel.send("There was an error processing your request.");
    }
  }
}

module.exports = handleBotMention;
