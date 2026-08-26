import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting MySQL Database Seeding for SIGAP...");

  const superPassword = await bcrypt.hash("super123", 10);
  const now = new Date();

  // Seed Default Super Admin Account Only
  await prisma.$executeRawUnsafe(
    `INSERT INTO admin_users (id, username, password, nama, role, is_banned, created_at, updated_at) 
     VALUES ('adm-super-001', 'superadmin', ?, 'Super Admin SIGAP', 'SUPER_ADMIN', FALSE, ?, ?)
     ON DUPLICATE KEY UPDATE 
       username = 'superadmin',
       password = VALUES(password),
       nama = 'Super Admin SIGAP',
       role = 'SUPER_ADMIN',
       is_banned = FALSE,
       updated_at = ?`,
    superPassword,
    now,
    now,
    now
  );
  console.log("Super Admin Seeded: Username (superadmin)");

  console.log("MySQL Database Seeding Completed!");
}

main()
  .catch((e) => {
    console.error("Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
