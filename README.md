# Discord Chat Bot

The Discord Chat Bot is a NodeJS-powered chatbot for Discord. It incorporates various features and utilizes the Discord.js library, offering dynamic functionalities and enhancing user interaction within Discord servers.

## Features

### ChatAI
- The bot leverages the `chatgpt-3.5-turbo` model from OpenAI to offer engaging conversational responses.

### URL Embedding
- Enhance tweet visibility: Any shared link from `https://twitter..` gets transformed into `https://vxtwitter..`, allowing tweets to be embedded directly in the chat.

### Commands
- The bot recognizes commands prefixed with `!`.
- Use the `!help` command to view a comprehensive list of available bot commands.

### Event Logging
- The bot can handle various events, such as members joining or leaving the server and message updates.
- Logged messages will be in ``#logs`` channel

### Misc Features
- When the bot is mentioned using `@IceBot`, it responds interactively.
- Integrated loggers such as `logFateSus` to manage specific use cases.
- Robust error handling: If any command runs into an issue, the bot informs the user about the encountered error.
  
## Adding the Bot to Your Server

To invite the bot to your server, click [here](https://discord.com/api/oauth2/authorize?client_id=1053064397792223273&permissions=75776&scope=bot) or navigate to the following URL:

```
https://discord.com/api/oauth2/authorize?client_id=1053064397792223273&permissions=75776&scope=bot
```

After adding the bot to your server, interact with it by mentioning `@IceBot` or by using the available commands.

## Setup and Deployment

The bot is set up to run persistently and is hosted on Repl.it for consistent 24/7 uptime.

## TODO List

1. Restrict bot activity to a specific channel name or call. - DONE
2. Provide documentation on how to add the bot to servers. - ADDED
3. Enhance the bot with more functionalities.
4. Continuously train and optimize the bot for improved performance and responsiveness.

![image](https://user-images.githubusercontent.com/58054670/215863455-92f76c9e-6a51-4364-8f17-4ddb3ba2019a.png)
