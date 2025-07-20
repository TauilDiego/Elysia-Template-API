import db from "../../utils/db"
import * as bun from "bun";

export async function getUsers() {
  try {
    return await db.user.findMany();
  } catch (e: unknown) {
    console.error(e)
  }
}

export async function postUsers(options: { email: string; password: string, name: string, cpf: string}) {
  try {
    const {email, password, name, cpf } = options;

    return await db.user.create({data: { email, name, cpf, password: await bun.password.hash(password) }});
  } catch (e: unknown) {
    console.error(e)
  }
}

export async function putUsers(id: string, options: { name: string, cpf: string }) {
  try {
    const {name, cpf} = options;
    
    return await db.user.update({
      where: {
        id: id
      },
      data: {
        cpf,
        name
      }
    })

  } catch (e) {
    console.error("Error: ", e);
    
  }
}

export async function getUserById(id: string) {
  try {
    return await db.user.findFirst({
      where:  {
        id: id
      }
    })
  } catch(e: unknown) {
    console.error(e)
  }
}