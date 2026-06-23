import OpenAI from 'openai';

const hasNvidiaKey = Boolean(process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.trim());

const nvidia = hasNvidiaKey
  ? new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
      timeout: 60000,
      maxRetries: 0
    })
  : null;

const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'google/gemma-4-31b-it';

function normalizeStudyText(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();
}

function cleanJsonText(content) {
  const rawContent = String(content || '').trim();

  const jsonBlockMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (jsonBlockMatch?.[1]) {
    return jsonBlockMatch[1].trim();
  }

  const firstBraceIndex = rawContent.indexOf('{');
  const lastBraceIndex = rawContent.lastIndexOf('}');

  if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
    return rawContent.slice(firstBraceIndex, lastBraceIndex + 1).trim();
  }

  return rawContent;
}

function safeJsonParse(content) {
  try {
    return JSON.parse(cleanJsonText(content));
  } catch (error) {
    console.error('Failed to parse NVIDIA JSON response:', {
      message: error.message,
      rawContentPreview: String(content || '').slice(0, 1200)
    });

    throw new Error('AI provider returned invalid JSON.');
  }
}

function validateAiMaterials(materials) {
  const summary = String(materials?.summary || '').trim();

  const keyTerms = Array.isArray(materials?.keyTerms)
    ? materials.keyTerms
        .filter((item) => item?.term && item?.definition)
        .map((item) => ({
          term: String(item.term).trim(),
          definition: String(item.definition).trim()
        }))
        .slice(0, 12)
    : [];

  const studyPlan = Array.isArray(materials?.studyPlan)
    ? materials.studyPlan
        .filter((item) => item?.title && item?.description)
        .map((item, index) => ({
          step: Number(item.step) || index + 1,
          title: String(item.title).trim(),
          description: String(item.description).trim()
        }))
        .slice(0, 6)
    : [];

  const flashcards = Array.isArray(materials?.flashcards)
    ? materials.flashcards
        .filter((item) => item?.front && item?.back)
        .map((item, index) => ({
          front: String(item.front).trim(),
          back: String(item.back).trim(),
          order: Number(item.order) || index + 1
        }))
        .slice(0, 12)
    : [];

  const quiz = Array.isArray(materials?.quiz)
    ? materials.quiz
        .filter((item) => {
          const hasQuestion = Boolean(item?.question);
          const hasOptions = Array.isArray(item?.options) && item.options.length === 4;
          const correctAnswerIndex = Number(item?.correctAnswerIndex);
          const hasValidCorrectIndex = Number.isInteger(correctAnswerIndex)
            && correctAnswerIndex >= 0
            && correctAnswerIndex <= 3;

          return hasQuestion && hasOptions && hasValidCorrectIndex;
        })
        .map((item, index) => ({
          question: String(item.question).trim(),
          options: item.options.map((option) => String(option).trim()),
          correctAnswerIndex: Number(item.correctAnswerIndex),
          explanation: String(item.explanation || '').trim(),
          order: Number(item.order) || index + 1
        }))
        .slice(0, 8)
    : [];

  if (!summary) {
    throw new Error('AI response is missing summary.');
  }

  if (keyTerms.length < 5) {
    throw new Error('AI response does not contain enough key terms.');
  }

  if (studyPlan.length < 3) {
    throw new Error('AI response does not contain enough study plan steps.');
  }

  if (flashcards.length < 5) {
    throw new Error('AI response does not contain enough flashcards.');
  }

  if (quiz.length < 5) {
    throw new Error('AI response does not contain enough quiz questions.');
  }

  return {
    summary,
    keyTerms,
    studyPlan,
    flashcards,
    quiz
  };
}

function validateQuizOnlyMaterials(materials) {
  const quiz = Array.isArray(materials?.quiz)
    ? materials.quiz
        .filter((item) => {
          const hasQuestion = Boolean(item?.question);
          const hasOptions = Array.isArray(item?.options) && item.options.length === 4;
          const correctAnswerIndex = Number(item?.correctAnswerIndex);
          const hasValidCorrectIndex = Number.isInteger(correctAnswerIndex)
            && correctAnswerIndex >= 0
            && correctAnswerIndex <= 3;

          return hasQuestion && hasOptions && hasValidCorrectIndex;
        })
        .map((item, index) => ({
          question: String(item.question).trim(),
          options: item.options.map((option) => String(option).trim()),
          correctAnswerIndex: Number(item.correctAnswerIndex),
          explanation: String(item.explanation || '').trim(),
          order: Number(item.order) || index + 1
        }))
        .slice(0, 8)
    : [];

  if (quiz.length < 5) {
    throw new Error('AI response does not contain enough quiz questions.');
  }

  return quiz;
}

function buildEducationalPrompt({ title, text, language }) {
  const responseLanguage = language === 'BG' ? 'Bulgarian' : 'English';

  return `
You are a university-level educational assistant inside a Smart Study Assistant web app.

Your task:
Generate high-quality study materials from the provided study text.

Output language:
All user-facing content must be in ${responseLanguage}.

You must return ONLY valid JSON.
Do not use markdown.
Do not wrap the response in code fences.
Do not add explanations outside the JSON.

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

Quality requirements:
1. The summary must be educational, structured and useful for exam preparation.
2. Do not copy random fragments as the summary.
3. Explain the topic clearly.
4. Generate 6 to 12 real key terms from the text.
5. Key term definitions must explain the terms in context.
6. Generate 3 to 6 practical study plan steps.
7. Generate 6 to 12 flashcards.
8. Generate 5 to 8 quiz questions.
9. Quiz questions must test understanding, not simple word matching.
10. Every quiz question must have exactly 4 options.
11. Only one option must be correct.
12. correctAnswerIndex must be 0, 1, 2 or 3.
13. Distractors must be plausible but clearly wrong.
14. Explanations must explain why the correct answer is correct.
15. Use only the provided text. Do not invent unsupported facts.
16. If the text contains OCR mistakes, infer carefully without hallucinating.

Topic title:
${title}

Study text:
${text.slice(0, 24000)}
`;
}

function buildDifferentQuizPrompt({ title, text, language, previousQuiz }) {
  const responseLanguage = language === 'BG' ? 'Bulgarian' : 'English';

  const previousQuestions = previousQuiz
    .map((question) => question.question)
    .filter(Boolean)
    .slice(0, 20)
    .join('\n- ');

  return `
You are a university-level educational quiz generator inside a Smart Study Assistant web app.

Your task:
Generate a NEW and DIFFERENT quiz from the provided study text.

Output language:
All user-facing content must be in ${responseLanguage}.

You must return ONLY valid JSON.
Do not use markdown.
Do not wrap the response in code fences.
Do not add explanations outside the JSON.

Required JSON structure:
{
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

Quality requirements:
1. Generate 5 to 8 questions.
2. Do not repeat previous questions.
3. Test understanding, not simple word matching.
4. Every question must have exactly 4 options.
5. Only one option must be correct.
6. correctAnswerIndex must be 0, 1, 2 or 3.
7. Distractors must be plausible but wrong.
8. Every explanation must explain why the correct answer is correct.
9. Use only the provided text. Do not invent unsupported facts.
10. Make the new quiz different in wording, focus and answer choices.

Previous questions that must NOT be repeated:
- ${previousQuestions || 'No previous questions.'}

Topic title:
${title}

Study text:
${text.slice(0, 24000)}
`;
}

async function callNvidiaJson(prompt, maxTokens = 4096, temperature = 0.25) {
  if (!nvidia) {
    throw new Error('NVIDIA_API_KEY is missing. Add it to server/.env and restart the backend.');
  }

  try {
    const completion = await nvidia.chat.completions.create(
      {
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'user',
            content: `
You are a strict educational assistant.

Critical response rules:
- Return only valid JSON.
- Do not use markdown.
- Do not wrap the response in code fences.
- Do not add explanations outside the JSON.
- All generated educational content must follow the requested output language.

${prompt}
`
          }
        ],
        temperature,
        top_p: 0.9,
        max_tokens: maxTokens
      },
      {
        timeout: 180000
      }
    );

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('NVIDIA returned an empty response.');
    }

    return safeJsonParse(content);
  } catch (error) {
    console.error('NVIDIA NIM request failed:', {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response?.data
    });

    throw error;
  }
}

export async function generateAiMaterials({ title, text, language }) {
  const safeText = normalizeStudyText(text);

  if (!safeText || safeText.length < 20) {
    throw new Error('Topic text is required for AI generation.');
  }

  const prompt = buildEducationalPrompt({
    title,
    text: safeText,
    language
  });

  const parsed = await callNvidiaJson(prompt, 2500, 0.25);

  return {
    ...validateAiMaterials(parsed),
    provider: 'NVIDIA NIM'
  };
}

export async function generateDifferentQuizForTopic({ title, text, language, previousQuiz = [] }) {
  const safeText = normalizeStudyText(text);

  if (!safeText || safeText.length < 20) {
    throw new Error('Topic text is required for quiz generation.');
  }

  const prompt = buildDifferentQuizPrompt({
    title,
    text: safeText,
    language,
    previousQuiz
  });

  const parsed = await callNvidiaJson(prompt, 1800, 0.55);

  return validateQuizOnlyMaterials(parsed);
}