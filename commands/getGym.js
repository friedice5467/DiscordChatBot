const { EmbedBuilder } = require('discord.js');
const getExercise = require('../helpers/ninjaExerciseHandler.js');

module.exports = {
    name: 'getgym',
    description: 'Fetches a random exercise from the Ninja Exercise API',
    execute: async function(message, args) {
        try {
            let exerciseData = await getExercise();
            let randomExercise = exerciseData[Math.floor(Math.random() * exerciseData.length)];
            console.log(randomExercise);
            const exerciseEmbed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle(randomExercise.name)
                .setDescription(randomExercise.instructions)
                .addFields(
                    { name: 'Type', value: randomExercise.type, inline: true },
                    { name: 'Targeted Muscle', value: randomExercise.muscle, inline: true }, 
                    { name: 'Equipment Needed', value: randomExercise.equipment, inline: true }, 
                    { name: 'Difficulty Level', value: randomExercise.difficulty, inline: true },
                )
                .setTimestamp(); 

            message.channel.send({ embeds: [exerciseEmbed] });
        } catch (error) {
            console.error(`There was an error: ${error.message}`);
        }
    }
};
