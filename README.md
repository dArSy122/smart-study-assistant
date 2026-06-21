# Smart Study Assistant

Smart Study Assistant е двуезично уеб приложение на български и английски език, създадено като университетски практически проект.

## Цел на проекта

Целта на проекта е да покаже завършено уеб приложение с реална практическа стойност. Приложението помага на студент или ученик да създава учебни теми, да извлича текст от снимка чрез OCR, да генерира учебни материали чрез AI, да решава тестове и да следи личния си напредък.

## Основна идея

Потребителят създава учебна тема чрез ръчно въвеждане на текст или чрез качване на изображение с учебен материал. Системата извлича текст чрез OCR, позволява редакция на получения текст и генерира учебни материали:

- обобщение
- важни понятия
- учебен план
- flashcards
- quiz

След решаване на тест приложението записва резултата и показва статистика.

## Технологии

### Frontend

- React
- Vite
- React Router
- i18next
- Tesseract.js
- Web Speech API
- Chart.js или Recharts
- CSS Grid
- PWA manifest
- Service worker

### Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT authentication
- bcrypt
- dotenv
- CORS
- Zod или express-validator

### AI

AI логиката се намира само в backend частта.

Файл:

server/src/services/aiService.js

OpenAI API ключът се пази само в server .env файл.

Ако няма OpenAI API ключ, приложението работи с fallback AI генератор.

## База данни

Основната база данни е MySQL.

Име на базата:

smart_study_assistant

Prisma datasource:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}