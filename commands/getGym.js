const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

async function fetchFromChatGPT(muscle, duration, type, level = "beginner", intensity) {
    const payload = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `You are a personal trainer API for a CrossFit gym. Give me ${muscle} workouts for an individual for ${duration} based on their physical level, which is: ${level} and the intensity at which they want it, which is: ${intensity}. For context, the highest physical level, which is elite athlete, can do 100 pushups a minute, and bench 3x their bodyweight. A beginner can do 10 pushups a minute, and not even hit bodyweight bench. An individual with higher physical level should have more challenging workouts, and a high intensity will increase the reps/set. Give me proper workout names. The description for each workout should be ${type}. The workouts should compliment each other. The response should look like a json like this
[
  {
    "name": "Incline Hammer Curls",
    "type": "strength",
    "muscle": "biceps",
    "equipment": "dumbbell",
    "difficulty": "beginner",
    "instructions": "instructions here",
    "reps": "4", 
    "sets": "2"
  },
...
only give me the json response, do not reply with anything else. Do not say you understand or whatever, just give me the json response like you are emulating an api. `
            }
        ],
        temperature: 0.7
    };

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env['OPENAI_API_KEY']}`,
        "OpenAI-Organization": "org-LoT4AVQYU9MyQOrCaBxLJrhZ"
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: headers
    });

    const data = await response.json();
    
    if (response.ok && data.choices && data.choices.length > 0) {
        const replyContent = data.choices[0].message.content.trim();
        return JSON.parse(replyContent);
    } else {
        throw new Error("Couldn't fetch exercises from ChatGPT.");
    }
}


module.exports = {
  name: 'getgym',
  description: 'Fetches a random exercise from the ChatGPT API',
  execute: async function(message, args) {
    try {
      message.channel.sendTyping();
      const validMuscles = [
        'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 'chest', 'forearms', 'glutes',
        'hamstrings', 'lats', 'lower_back', 'middle_back', 'neck', 'quadriceps', 'traps', 'triceps'
      ];
      const validTypes = ['simple', 'full'];
      const physicalLevels = {
    '1': 'beginner gym goer',
    '2': 'intermediate, been going to the gym for 1 year',
    '3': 'pro, gym goer for 5+ years looking for a challenge',
    '4': 'super elite athlete/bodybuilder, gym goer working out their whole life'
};

const intensities = {
    '1': 'low',
    '2': 'medium',
    '3': 'high',
    '4': 'David Goggins super high intensity SEAL training they should be near fainting'
};
      
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
          case 'level':
            const levelEmbed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('Physical Level')
                .setDescription(`\`\`\`${Object.entries(physicalLevels).map(([key, val]) => `${key} - ${val}`).join('\n')}\`\`\``);
            return message.channel.send({ embeds: [levelEmbed] });
        case 'intensity':
            const intensityEmbed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('Intensity Level')
                .setDescription(`\`\`\`${Object.entries(intensities).map(([key, val]) => `${key} - ${val}`).join('\n')}\`\`\``);
            return message.channel.send({ embeds: [intensityEmbed] });
        }
      }

      if (args.length !== 5) {
    return message.channel.send('Please specify a muscle, duration, type, physical level, and intensity. Example: \`\`!getgym biceps 1hr simple 2 2\`\`\n\nFor more information use the provided keywords respectively.');
}

      const muscle = args[0].toLowerCase();
      if (!validMuscles.includes(muscle)) {
        return message.channel.send(`Invalid muscle. Please choose from the following: ${validMuscles.join(', ')}`);
      }

      const durationMatch = args[1].toLowerCase().match(/^(\d+(?:\.\d+)?)hr$/);
if (!durationMatch) {
    return message.channel.send('Invalid duration. Please specify the duration in hours, e.g., 1hr or 0.5hr.');
}
const duration = parseFloat(durationMatch[1]);

      const type = args[2].toLowerCase();
      if (!validTypes.includes(type)) {
        return message.channel.send("Invalid type. Please choose either 'simple' or 'full'.");
      }

      const levelKey = args[3];
if (!physicalLevels[levelKey]) {
    return message.channel.send(`Invalid physical level. Please choose from the following:\n${Object.entries(physicalLevels).map(([key, val]) => `${key} - ${val}`).join(', ')}`);
}

const intensityKey = args[4];
if (!intensities[intensityKey]) {
    return message.channel.send(`Invalid intensity. Please choose from the following:\n${Object.entries(intensities).map(([key, val]) => `${key} - ${val}`).join(', ')}`);
}

const level = physicalLevels[levelKey];
const intensity = intensities[intensityKey];

const exercises = await fetchFromChatGPT(muscle, `${duration}hr`, type, level, intensity);

      if (type === 'simple') {
        const exerciseEmbed = new EmbedBuilder()
          .setColor('#0099FF')
          .setTitle(`${muscle} workout for a physical level of ${level} at ${intensity} intensity`)
          .setDescription('This is the generated workout based on your requirements');
        
        for (let exercise of exercises) {
          exerciseEmbed.addFields({ name: exercise.name, value: `Sets: ${exercise.sets}, Reps: ${exercise.reps}`, inline: true });
        }
        return message.channel.send({ embeds: [exerciseEmbed] });
      }

      if (type === 'full') {
        for (let exercise of exercises) {
          const exerciseEmbed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle(exercise.name)
            .setDescription(exercise.instructions)
            .addFields(
              { name: 'Type', value: exercise.type, inline: true },
              { name: 'Targeted Muscle', value: exercise.muscle, inline: true },
              { name: 'Equipment Needed', value: exercise.equipment, inline: true },
              { name: 'Difficulty Level', value: exercise.difficulty, inline: true },
              { name: 'Sets', value: exercise.set, inline: true },
              { name: 'Reps', value: exercise.reps, inline: true },
            );
          message.channel.send({ embeds: [exerciseEmbed] });
        }
      }
    } catch (error) {
      console.error(`There was an error: ${error.message}`);
      message.channel.send('An error occurred while fetching the workout.');
    }
  }
};