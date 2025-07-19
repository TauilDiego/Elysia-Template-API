import db from "../../db"

export async function getUsers() {
  try {
    return await db.user.findMany();
  } catch (e: unknown) {
    console.error(e)
  }
}

export async function postUsers(options: { email: string; password: string, name: string }) {
  try {
    const {email, password, name } = options;

    return await db.user.create({data: { email, name, password }});
  } catch (e: unknown) {
    console.error(e)
  }
}