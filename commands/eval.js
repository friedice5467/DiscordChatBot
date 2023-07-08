const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const removeCommandMessage = require('../services/AutoRemoveMessageService');

module.exports = {
  name: 'eval',
  description: 'Executes C# code',
  async execute(message, args) {

  function truncate(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}
    
    try {
      const code = args.join(' ');
      
      // Send a message stating that the code is being executed
      const executingMessage = await message.channel.send('Compiling and executing your code...');
      
      const response = await fetch(`${process.env['csharprepl']}/eval`, {
        method: 'POST',
        body: code,
        headers: { 'Content-Type': 'text/plain' },
      });

      if (response.ok) {
        const result = await response.json();

        // Define embed fields
        const embedFields = [
          { name: 'Code', value: `\`\`\`csharp\n${truncate(code, 1000)}\`\`\``, inline: false },
          { name: 'Console Output', value: `\`\`\`txt\n${truncate(result.ConsoleOut, 1000)}\`\`\``, inline: false },
        ];

        if (result.ReturnValue) {
          embedFields.push({ name: `Result: ${result.ReturnTypeName}`, value: `\`\`\`json\n${truncate(result.ReturnValue.toString(), 1000)}\`\`\``, inline: false });
        }

        if (result.Exception) {
          embedFields.push({ name: `Exception: ${result.ExceptionType}`, value: `\`\`\`diff\n- ${truncate(result.Exception, 1000)}\`\`\``, inline: false });
        }

        const embed = new EmbedBuilder()
          .setTitle(`REPL Result: ${result.Exception ? 'Failure' : 'Success'}`)
          .setColor(result.Exception ? '#FF0000' : '#00FF00')
          .addFields(...embedFields)
          .setFooter(`Compile: ${result.CompileTime}ms | Execution: ${result.ExecutionTime}ms`);

        executingMessage.edit({ content: '', embeds: [embed] });

        // Delete the original command message
        await removeCommandMessage(message);
      } else {
        const errorEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('Error')
          .setDescription(`Error: ${response.status}`);
        executingMessage.edit({ content: '', embeds: [errorEmbed] });
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription(`Error: ${error.message}`);
      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
