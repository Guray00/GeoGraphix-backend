import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	prisma.user.upsert({
        where: { email: "userfake@mail.it"},
        update: {},
        create: {
          email: "userfake@mail.it",
		  
		  // this is a hashed version of "twixrox"
          password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
          name: "Doe",

		  created_at: new Date(),
		  updated_at: new Date(),
		  deleted_at: null,
		  },
      })
  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });