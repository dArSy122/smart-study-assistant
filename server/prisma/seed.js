import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const studentPasswordHash = await bcrypt.hash('Student123!', 10);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@smartstudy.local'
    },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@smartstudy.local',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      languagePreference: 'BG',
      notificationPreference: {
        create: {
          enabled: true,
          preferredTime: '09:00'
        }
      }
    }
  });

  const student = await prisma.user.upsert({
    where: {
      email: 'student@smartstudy.local'
    },
    update: {},
    create: {
      name: 'Student User',
      email: 'student@smartstudy.local',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      languagePreference: 'BG',
      notificationPreference: {
        create: {
          enabled: true,
          preferredTime: '18:00'
        }
      }
    }
  });

  const topic = await prisma.studyTopic.upsert({
    where: {
      id: 1
    },
    update: {},
    create: {
      userId: student.id,
      title: 'Въведение в изкуствения интелект',
      originalText:
        'Изкуственият интелект е област от компютърните науки, която създава системи, способни да изпълняват задачи, свързани с човешко мислене.',
      ocrText:
        'Изкуственият интелект е област от компютърните науки, която създава системи, способни да изпълняват задачи, свързани с човешко мислене.',
      finalText:
        'Изкуственият интелект е област от компютърните науки, която създава системи, способни да изпълняват задачи, свързани с човешко мислене.',
      language: 'BG',
      status: 'GENERATED'
    }
  });

  await prisma.aIResult.upsert({
    where: {
      topicId: topic.id
    },
    update: {},
    create: {
      topicId: topic.id,
      summary:
        'Изкуственият интелект позволява на компютърни системи да анализират информация, да разпознават модели и да подпомагат решаването на задачи.',
      keyTerms: [
        {
          term: 'Изкуствен интелект',
          definition: 'Област, която създава системи с поведение, близко до човешко мислене.'
        },
        {
          term: 'Машинно обучение',
          definition: 'Метод, при който системата подобрява резултатите си чрез данни.'
        },
        {
          term: 'Модел',
          definition: 'Алгоритъм или система, обучена да обработва информация.'
        }
      ],
      studyPlan: [
        {
          step: 1,
          title: 'Прочит на основния текст',
          description: 'Прочети темата и отбележи непознатите понятия.'
        },
        {
          step: 2,
          title: 'Преговор на понятия',
          description: 'Преговори важните термини и техните определения.'
        },
        {
          step: 3,
          title: 'Решаване на тест',
          description: 'Провери знанията си чрез кратък quiz.'
        }
      ],
      flashcardsJson: [
        {
          front: 'Какво е изкуствен интелект?',
          back: 'Област от компютърните науки, която създава системи за задачи, свързани с човешко мислене.'
        },
        {
          front: 'Каква е ролята на данните?',
          back: 'Данните помагат на системата да разпознава модели и да дава по-добри резултати.'
        }
      ],
      quizJson: [
        {
          question: 'Какво изучава изкуственият интелект?',
          options: [
            'Само хардуерни компоненти',
            'Системи, които изпълняват задачи, свързани с човешко мислене',
            'Само компютърни мрежи',
            'Само уеб дизайн'
          ],
          correctAnswerIndex: 1
        },
        {
          question: 'Какво е машинно обучение?',
          options: [
            'Процес на подобрение чрез данни',
            'Тип монитор',
            'Операционна система',
            'Физическа памет'
          ],
          correctAnswerIndex: 0
        }
      ]
    }
  });

  await prisma.quizAttempt.create({
    data: {
      userId: student.id,
      topicId: topic.id,
      score: 2,
      totalQuestions: 2,
      answersJson: [
        {
          questionIndex: 0,
          selectedAnswerIndex: 1,
          isCorrect: true
        },
        {
          questionIndex: 1,
          selectedAnswerIndex: 0,
          isCorrect: true
        }
      ]
    }
  });

  await prisma.activityLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'SEED_ADMIN_CREATED',
        details: {
          email: admin.email
        }
      },
      {
        userId: student.id,
        action: 'SEED_STUDENT_CREATED',
        details: {
          email: student.email
        }
      },
      {
        userId: student.id,
        action: 'SEED_TOPIC_CREATED',
        details: {
          topicId: topic.id,
          title: topic.title
        }
      }
    ],
    skipDuplicates: false
  });

  console.log('Seed completed successfully.');
  console.log('Admin login: admin@smartstudy.local / Admin123!');
  console.log('Student login: student@smartstudy.local / Student123!');
}

main()
  .catch((error) => {
    console.error('Seed failed.');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });