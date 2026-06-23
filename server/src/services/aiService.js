import OpenAI from 'openai';

const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());

const openai = hasOpenAiKey
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null;

function splitIntoSentences(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function extractKeyTerms(text) {
  const words = String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 4);

  const stopWords = new Set([
    'които',
    'това',
    'като',
    'след',
    'може',
    'трябва',
    'where',
    'which',
    'there',
    'their',
    'about',
    'because',
    'study',
    'topic'
  ]);

  const frequency = new Map();

  words.forEach((word) => {
    if (!stopWords.has(word)) {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    }
  });

  return [...frequency.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 8)
    .map(([term]) => ({
      term,
      definition: `Important concept found in the study text: ${term}`
    }));
}

function createFallbackQuiz(sentences, language) {
  const isBulgarian = language === 'BG';

  const questionsSource = sentences.length > 0 ? sentences : [
    isBulgarian ? 'Учебният материал трябва да бъде прочетен внимателно.' : 'The study material should be read carefully.'
  ];

  return questionsSource.slice(0, 5).map((sentence, index) => ({
    question: isBulgarian
      ? `Кое твърдение е свързано с материала?`
      : `Which statement is related to the study material?`,
    options: [
      sentence,
      isBulgarian ? 'Това твърдение не е свързано с темата.' : 'This statement is not related to the topic.',
      isBulgarian ? 'Това е случаен отговор.' : 'This is a random answer.',
      isBulgarian ? 'Няма достатъчно информация.' : 'There is not enough information.'
    ],
    correctAnswerIndex: 0,
    explanation: isBulgarian
      ? `Отговорът се намира в текста на темата.`
      : `The answer is based on the topic text.`,
    order: index + 1
  }));
}

function createFallbackAiMaterials({ title, text, language }) {
  const isBulgarian = language === 'BG';
  const sentences = splitIntoSentences(text);
  const summarySentences = sentences.slice(0, 4);

  const summary = summarySentences.length > 0
    ? summarySentences.join('. ') + '.'
    : isBulgarian
      ? `Темата "${title}" съдържа учебен материал, който трябва да бъде прегледан и обобщен.`
      : `The topic "${title}" contains study material that should be reviewed and summarized.`;

  const keyTerms = extractKeyTerms(text);

  const fallbackKeyTerms = keyTerms.length > 0
    ? keyTerms
    : [
        {
          term: isBulgarian ? 'Основна идея' : 'Main idea',
          definition: isBulgarian ? 'Централното понятие в учебния материал.' : 'The central concept in the study material.'
        }
      ];

  const studyPlan = [
    {
      step: 1,
      title: isBulgarian ? 'Прочит на материала' : 'Read the material',
      description: isBulgarian ? 'Прочети темата внимателно и маркирай важните части.' : 'Read the topic carefully and mark the important parts.'
    },
    {
      step: 2,
      title: isBulgarian ? 'Преговор на понятията' : 'Review key terms',
      description: isBulgarian ? 'Запомни основните понятия и връзките между тях.' : 'Study the key terms and the connections between them.'
    },
    {
      step: 3,
      title: isBulgarian ? 'Самопроверка' : 'Self-check',
      description: isBulgarian ? 'Реши теста и провери слабите места.' : 'Take the quiz and identify weak points.'
    }
  ];

  const flashcards = fallbackKeyTerms.slice(0, 8).map((item, index) => ({
    front: item.term,
    back: item.definition,
    order: index + 1
  }));

  const quiz = createFallbackQuiz(sentences, language);

  return {
    summary,
    keyTerms: fallbackKeyTerms,
    studyPlan,
    flashcards,
    quiz
  };
}

function safeJsonParse(content) {
  const cleanedContent = String(content || '')
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleanedContent);
}

export async function generateAiMaterials({ title, text, language }) {
  const safeText = String(text || '').trim();

  if (!safeText) {
    throw new Error('Topic text is required for AI generation.');
  }

  if (!openai) {
    return createFallbackAiMaterials({ title, text: safeText, language });
  }

  const responseLanguage = language === 'BG' ? 'Bulgarian' : 'English';

  const prompt = `
You are an educational assistant. Generate study materials in ${responseLanguage}.
Return ONLY valid JSON. No markdown.

Required JSON structure:
{
  "summary": "string",
  "keyTerms": [
    { "term": "string", "definition": "string" }
  ],
  "studyPlan": [
    { "step": 1, "title": "string", "description": "string" }
  ],
  "flashcards": [
    { "front": "string", "back": "string", "order": 1 }
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswerIndex": 0,
      "explanation": "string",
      "order": 1
    }
  ]
}

Rules:
- Make the summary clear and useful.
- Generate 6 to 10 key terms.
- Generate 3 to 5 study plan steps.
- Generate 6 to 10 flashcards.
- Generate 5 quiz questions.
- correctAnswerIndex must be 0, 1, 2 or 3.
- The quiz must be answerable from the provided text.

Topic title:
${title}

Study text:
${safeText.slice(0, 12000)}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4
    });

    const content = completion.choices[0]?.message?.content;
    const parsed = safeJsonParse(content);

    return {
      summary: parsed.summary || '',
      keyTerms: Array.isArray(parsed.keyTerms) ? parsed.keyTerms : [],
      studyPlan: Array.isArray(parsed.studyPlan) ? parsed.studyPlan : [],
      flashcards: Array.isArray(parsed.flashcards) ? parsed.flashcards : [],
      quiz: Array.isArray(parsed.quiz) ? parsed.quiz : []
    };
  } catch (error) {
    console.warn('OpenAI generation failed. Using fallback AI generator.');
    return createFallbackAiMaterials({ title, text: safeText, language });
  }
}