import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "income",    displayName: "Renda",       icon: "💼",                background: "#DE9AC3", isIncome: true,  isDefault: true },
  { name: "food",      displayName: "Alimentação", icon: "🍔",            background: "#DEA17B", isIncome: false, isDefault: true },
  { name: "house",     displayName: "Casa",        icon: "🏠",                background: "#E6E088", isIncome: false, isDefault: true },
  { name: "education", displayName: "Educação",    icon: "📚",                background: "#AB8FBE", isIncome: false, isDefault: true },
  { name: "travel",    displayName: "Viagens",     icon: "✈️", background: "#82C9DE", isIncome: false, isDefault: true },
];

async function main() {
  for (const c of defaultCategories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: { icon: c.icon }, 
      create: c,
    });
  }
  console.log("Seed concluído.");
}

main()
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  })
  .finally(() => prisma.$disconnect());