const { PrismaClient } = require('@prisma/client');

const client = new PrismaClient()

const rootUser = {
  id: 1,
  email: "tauildiego@icloud.com",
  password: "12345678",
  name: "diego tauil",
}

const seed = async (user) => {
  console.log("Creating root user")

  await client.user.upsert({
    where: {id: user.id},
    update: user,
    create: user
  })
}

seed(rootUser)
  .then(() => {
    console.log("Created/updated root user successfully.");
  })
.catch((err) => {
  console.error("Error:", err);
})
.finally(() => {
  client.$disconnect();
  console.log("Disconnected Prisma Client, exiting...")
})