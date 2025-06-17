import { PrismaClient } from "@/generated/prisma";


const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      email: "rfjbebv@prisma.io",
      name: "Андрей",
      department: "Разработка",
      age: 30,
      salary: 50000,
    },
  });

  await prisma.user.create({
    data: {
      email: "jh2be2u@prisma.io",
      name: "Никита",
      department: "Дизайн",
      age: 32,
      salary: 60000,
    },
  });
  await prisma.user.create({
    data: {
      email: "jbu3uff@prisma.io",
      name: "Владимир",
      department: "Маркетинг",
      age: 20,
      salary: 40000,
    },
  });
  await prisma.user.create({
    data: {
      email: "ejkfb2u@prisma.io",
      name: "Примат",
      department: "Клининг",
      age: 18,
      salary: 300000,
    },
  });
  await prisma.user.create({
    data: {
      email: "enjf2u@prisma.io",
      name: "Арсений",
      department: "СЕО",
      age: 17,
      salary: 70000,
    },
  });
  await prisma.user.create({
    data: {
      email: "ejubf2ui@prisma.io",
      name: "Гусеница",
      department: "Отдел продаж",
      age: 90,
      salary: 100000,
    },
  });

  console.log("Работяги загружены");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
