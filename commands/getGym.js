const { EmbedBuilder } = require('discord.js');
const getExercise = require('../helpers/ninjaExerciseHandler.js');

module.exports = {
  name: 'getgym',
  description: 'Fetches a random exercise from the Ninja Exercise API',
  execute: async function(message, args) {
    try {
      const validMuscles = [
        'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 'chest', 'forearms', 'glutes',
        'hamstrings', 'lats', 'lower_back', 'middle_back', 'neck', 'quadriceps', 'traps', 'triceps'
      ];
      const validTypes = ['simple', 'full'];

      if (args.length === 1) {
        switch(args[0]) {
          case 'muscle':
            const muscleEmbed = new EmbedBuilder()
              .setColor('#0099FF')
              .setTitle('Muscle List')
              .setDescription(`\`\`\` ${validMuscles.join('\n ')}\`\`\``);
            return message.channel.send({ embeds: [muscleEmbed] });
          case 'duration':
            const durationEmbed = new EmbedBuilder()
              .setColor('#0099FF')
              .setTitle('Duration')
              .setDescription('The duration indicates the length of your workout in hours. For example, 1hr means one hour.');
            return message.channel.send({ embeds: [durationEmbed] });
          case 'type':
            const typeEmbed = new EmbedBuilder()
              .setColor('#0099FF')
              .setTitle('Type')
              .setDescription('The bot can generate two types of workouts: simple and full. In simple mode, it will provide a list of exercises and the number of sets for each. In full mode, it will provide detailed instructions for each exercise.');
            return message.channel.send({ embeds: [typeEmbed] });
        }
      }

      if (args.length !== 3) {
        return message.channel.send('Please specify a muscle, a duration, and a response type. Example: \`\`!getgym biceps 1hr simple\`\`\n\nFor more information use \`\`!getgym muscle\`\`, \`\`!getgym duration\`\`, or \`\`!getgym type\`\`, respectively.');
      }

      const muscle = args[0].toLowerCase();
      if (!validMuscles.includes(muscle)) {
        return message.channel.send(`Invalid muscle. Please choose from the following: ${validMuscles.join(', ')}`);
      }

      const durationMatch = args[1].match(/(\d+\.\d+|\.\d+|\d+)/);
      if (!durationMatch) {
        return message.channel.send('Invalid duration. Please specify the duration in hours, e.g., 1hr or 0.5hr.');
      }
      const duration = parseFloat(durationMatch[0])

      const type = args[2].toLowerCase();
      if (!validTypes.includes(type)) {
        return message.channel.send("Invalid type. Please choose either 'simple' or 'full'.");
      }

      let exerciseData = await getExercise(muscle);
      let filteredExercises = exerciseData.filter(exercise => exercise.muscle === muscle);
      const roundedDuration = Math.round(duration * 2) / 2;
      let numExercises = Math.floor(roundedDuration * 4);
      let numSets = Math.floor(roundedDuration * 4);

      if(roundedDuration == 0){
        numExercises = 1;
        numSets = 3;
      }

      if (type === 'simple') {
        const exerciseEmbed = new EmbedBuilder()
          .setColor('#0099FF')
          .setTitle(`${muscle} workout`)
          .setDescription('This is the generated workout based on your requirements');
        for (let i = 0; i < numExercises; i++) {
          let randomExercise = filteredExercises[Math.floor(Math.random() * filteredExercises.length)];
          exerciseEmbed.addFields({ name: randomExercise.name, value: `Sets: ${numSets}`, inline: true });
        }
        return message.channel.send({ embeds: [exerciseEmbed] });
      }

      if (type === 'full') {
        for (let i = 0; i < numExercises; i++) {
          let randomExercise = filteredExercises[Math.floor(Math.random() * filteredExercises.length)];
          const exerciseEmbed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle(randomExercise.name)
            .setDescription(randomExercise.instructions)
            .addFields(
              { name: 'Type', value: randomExercise.type, inline: true },
              { name: 'Targeted Muscle', value: randomExercise.muscle, inline: true },
              { name: 'Equipment Needed', value: randomExercise.equipment, inline: true },
              { name: 'Difficulty Level', value: randomExercise.difficulty, inline: true },
              { name: 'Sets', value: numSets.toString(), inline: true },
            );
          message.channel.send({ embeds: [exerciseEmbed] });
        }
      }
    } catch (error) {
      console.error(`There was an error: ${error.message}`);
    }
  }
};
