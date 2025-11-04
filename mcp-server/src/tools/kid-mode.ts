/**
 * Kid Mode Tools
 *
 * Safe, educational tools for Kali's kid mode.
 * All tools are designed for a 5-year-old child.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callN8nWebhook } from '../utils/n8n-client.js';

/**
 * Kid Mode Tool Definitions
 */
export const kidModeTools: Tool[] = [
  {
    name: 'kali_speak',
    description: 'Make Kali speak using a friendly, encouraging voice. Perfect for teaching and encouragement!',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'What Kali should say',
        },
        emotion: {
          type: 'string',
          enum: ['happy', 'excited', 'encouraging', 'curious', 'gentle'],
          description: 'The emotion Kali should express',
          default: 'happy',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'kali_teach_lesson',
    description: 'Start an educational lesson with Kali',
    inputSchema: {
      type: 'object',
      properties: {
        subject: {
          type: 'string',
          enum: ['colors', 'numbers', 'letters', 'shapes', 'animals'],
          description: 'The subject to teach',
        },
        difficulty: {
          type: 'string',
          enum: ['easy', 'medium', 'challenge'],
          description: 'Difficulty level',
          default: 'easy',
        },
      },
      required: ['subject'],
    },
  },
  {
    name: 'kali_play_game',
    description: 'Start an interactive game with Kali',
    inputSchema: {
      type: 'object',
      properties: {
        game: {
          type: 'string',
          enum: ['simon_says', 'color_hunt', 'counting', 'memory', 'shape_detective'],
          description: 'The game to play',
        },
      },
      required: ['game'],
    },
  },
  {
    name: 'kali_tell_story',
    description: 'Have Kali tell an age-appropriate story',
    inputSchema: {
      type: 'object',
      properties: {
        story_type: {
          type: 'string',
          enum: ['adventure', 'animals', 'friendship', 'learning', 'silly'],
          description: 'Type of story',
          default: 'adventure',
        },
        length: {
          type: 'string',
          enum: ['short', 'medium', 'long'],
          description: 'Story length',
          default: 'short',
        },
      },
    },
  },
  {
    name: 'kali_show_emotion',
    description: 'Make Kali display an emotion on screen',
    inputSchema: {
      type: 'object',
      properties: {
        emotion: {
          type: 'string',
          enum: ['happy', 'excited', 'thinking', 'sleepy', 'surprised', 'proud'],
          description: 'The emotion to display',
        },
      },
      required: ['emotion'],
    },
  },
  {
    name: 'kali_ask_question',
    description: 'Have Kali ask an educational question',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['colors', 'numbers', 'shapes', 'letters', 'general'],
          description: 'Question category',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'kali_give_praise',
    description: 'Make Kali give encouraging praise',
    inputSchema: {
      type: 'object',
      properties: {
        achievement: {
          type: 'string',
          description: 'What to praise (optional)',
        },
      },
    },
  },
  {
    name: 'kali_learning_progress',
    description: 'Get learning progress for the child',
    inputSchema: {
      type: 'object',
      properties: {
        timeframe: {
          type: 'string',
          enum: ['today', 'week', 'month', 'all'],
          description: 'Time period for progress',
          default: 'today',
        },
      },
    },
  },
  {
    name: 'kali_camera_game',
    description: 'Start a camera-based learning game',
    inputSchema: {
      type: 'object',
      properties: {
        game_type: {
          type: 'string',
          enum: ['find_color', 'count_objects', 'find_shape', 'scavenger_hunt'],
          description: 'Type of camera game',
        },
        target: {
          type: 'string',
          description: 'What to find (e.g., "red", "circle", "3 items")',
        },
      },
      required: ['game_type', 'target'],
    },
  },
];

/**
 * Handle Kid Mode Tool Execution
 */
export async function handleKidModeTool(name: string, args: any) {
  console.error(`[KID MODE] Executing tool: ${name}`);

  switch (name) {
    case 'kali_speak':
      return await handleKaliSpeak(args);

    case 'kali_teach_lesson':
      return await handleTeachLesson(args);

    case 'kali_play_game':
      return await handlePlayGame(args);

    case 'kali_tell_story':
      return await handleTellStory(args);

    case 'kali_show_emotion':
      return await handleShowEmotion(args);

    case 'kali_ask_question':
      return await handleAskQuestion(args);

    case 'kali_give_praise':
      return await handleGivePraise(args);

    case 'kali_learning_progress':
      return await handleLearningProgress(args);

    case 'kali_camera_game':
      return await handleCameraGame(args);

    default:
      throw new Error(`Unknown kid mode tool: ${name}`);
  }
}

/**
 * Tool Handlers
 */

async function handleKaliSpeak(args: { text: string; emotion?: string }) {
  const { text, emotion = 'happy' } = args;

  // Call n8n webhook to generate Polly speech
  const result = await callN8nWebhook('/polly-speak', {
    text,
    voice: 'Joanna', // Kid-friendly voice
    emotion,
  });

  return {
    content: [
      {
        type: 'text',
        text: `Kali says (${emotion}): "${text}"`,
      },
    ],
  };
}

async function handleTeachLesson(args: { subject: string; difficulty?: string }) {
  const { subject, difficulty = 'easy' } = args;

  // Generate lesson content based on subject
  const lessons: Record<string, string> = {
    colors: `Let's learn about colors! Can you find something ${['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)]} in the room?`,
    numbers: `Time to practice counting! Let's count from 1 to ${difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20} together!`,
    letters: `Let's learn the letter ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}! Can you think of words that start with this letter?`,
    shapes: `Today we're learning about shapes! Let's find ${['circles', 'squares', 'triangles', 'rectangles'][Math.floor(Math.random() * 4)]}!`,
    animals: `Let's learn about animals! Did you know that ${['elephants', 'dolphins', 'owls', 'butterflies'][Math.floor(Math.random() * 4)]} are amazing creatures?`,
  };

  const lessonText = lessons[subject] || `Let's learn about ${subject}!`;

  // Speak the lesson
  await callN8nWebhook('/polly-speak', {
    text: lessonText,
    voice: 'Joanna',
    emotion: 'encouraging',
  });

  return {
    content: [
      {
        type: 'text',
        text: `Kali started a ${difficulty} ${subject} lesson:\n\n${lessonText}`,
      },
    ],
  };
}

async function handlePlayGame(args: { game: string }) {
  const { game } = args;

  const games: Record<string, string> = {
    simon_says: "Let's play Simon Says! I'll give you instructions, but only follow them if I say 'Simon says' first!",
    color_hunt: "Let's play Color Hunt! I'll name a color and you find something in that color!",
    counting: "Let's play the counting game! We'll count objects together and learn numbers!",
    memory: "Let's play a memory game! I'll show you some things and you try to remember them!",
    shape_detective: "Let's be shape detectives! We'll find different shapes all around us!",
  };

  const gameIntro = games[game] || `Let's play ${game}!`;

  await callN8nWebhook('/polly-speak', {
    text: gameIntro,
    voice: 'Joanna',
    emotion: 'excited',
  });

  return {
    content: [
      {
        type: 'text',
        text: `🎮 Kali started the ${game.replace('_', ' ')} game!\n\n${gameIntro}`,
      },
    ],
  };
}

async function handleTellStory(args: { story_type?: string; length?: string }) {
  const { story_type = 'adventure', length = 'short' } = args;

  return {
    content: [
      {
        type: 'text',
        text: `📖 Kali is telling a ${length} ${story_type} story...\n\n(Story content would be generated here, potentially using an AI model)`,
      },
    ],
  };
}

async function handleShowEmotion(args: { emotion: string }) {
  const { emotion } = args;

  return {
    content: [
      {
        type: 'text',
        text: `Kali is now showing "${emotion}" emotion on the display! 😊`,
      },
    ],
  };
}

async function handleAskQuestion(args: { category: string }) {
  const { category } = args;

  const questions: Record<string, string[]> = {
    colors: ['What color is the sky?', 'Can you find something red?', 'Whatsyour favorite color?'],
    numbers: ['How many fingers do you have?', 'Can you count to 5?', 'What number comes after 3?'],
    shapes: ['What shape is a ball?', 'Can you find a square?', 'How many sides does a triangle have?'],
    letters: ['What letter does your name start with?', 'Can you say the alphabet?', 'What sound does the letter B make?'],
    general: ['What is your favorite animal?', 'What makes you happy?', 'What did you learn today?'],
  };

  const questionList = questions[category] || questions.general;
  const question = questionList[Math.floor(Math.random() * questionList.length)];

  await callN8nWebhook('/polly-speak', {
    text: question,
    voice: 'Joanna',
    emotion: 'curious',
  });

  return {
    content: [
      {
        type: 'text',
        text: `❓ Kali asks: "${question}"`,
      },
    ],
  };
}

async function handleGivePraise(args: { achievement?: string }) {
  const { achievement } = args;

  const praises = [
    'Amazing job!',
    'You are doing great!',
    'That is wonderful!',
    'I am so proud of you!',
    'You are so smart!',
    'Keep up the great work!',
    'Fantastic!',
  ];

  const praise = achievement
    ? `${praises[Math.floor(Math.random() * praises.length)]} ${achievement}!`
    : praises[Math.floor(Math.random() * praises.length)];

  await callN8nWebhook('/polly-speak', {
    text: praise,
    voice: 'Joanna',
    emotion: 'excited',
  });

  return {
    content: [
      {
        type: 'text',
        text: `🌟 Kali says: "${praise}"`,
      },
    ],
  };
}

async function handleLearningProgress(args: { timeframe?: string }) {
  const { timeframe = 'today' } = args;

  // This would fetch actual progress from n8n/database
  return {
    content: [
      {
        type: 'text',
        text: `📊 Learning Progress (${timeframe}):\n\n` +
              `- Activities completed: 5\n` +
              `- Time spent learning: 25 minutes\n` +
              `- Favorite activity: Color Hunt\n` +
              `- Skills improving: Colors, Counting\n\n` +
              `Great job! Keep learning with Kali! 🎉`,
      },
    ],
  };
}

async function handleCameraGame(args: { game_type: string; target: string }) {
  const { game_type, target } = args;

  const instructions: Record<string, string> = {
    find_color: `Let's find something ${target}! Show it to my camera!`,
    count_objects: `Let's count ${target}! Show them to my camera and we'll count together!`,
    find_shape: `Let's find a ${target}! Look around and show me when you find one!`,
    scavenger_hunt: `Scavenger hunt time! Find ${target} and show me!`,
  };

  const instruction = instructions[game_type] || `Let's play! Find ${target}!`;

  await callN8nWebhook('/polly-speak', {
    text: instruction,
    voice: 'Joanna',
    emotion: 'excited',
  });

  return {
    content: [
      {
        type: 'text',
        text: `📷 Camera game started: ${game_type}\n\nKali says: "${instruction}"`,
      },
    ],
  };
}
