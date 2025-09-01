import db from "@/utils/db"
import * as bun from "bun";
import { createUser, updateUserData } from "./model"
import { Static } from "elysia";

export abstract class UserService {
  static async getUsers() {
    try {
      return await db.user.findMany({
        omit: {
          password: true
        }
      });
    } catch (e: unknown) {
      console.error(e)
    }
  }

  static async getUserById(id?: string) {
    try {
      return await db.user.findUnique({
        where: {
          id: id
        },
        omit: {
          password: true
        }
      })
    } catch (e: unknown) {
      console.error(e)
    }
  }

  static async getUserByEmail(email: string, omitPassword: boolean = true) {
    return await db.user.findUnique({
      where: {
        email: email
      },
      omit: {
        password: omitPassword
      },
    })
  }

  static async postUsers({ email, password, name, cpf }: Static<typeof createUser>) {
    try {
      return await db.user.create({
        data: { email, name, cpf, password: await bun.password.hash(password) },
        omit: { password: true }
      });
    } catch (e: unknown) {
      console.error(e)
    }
  }

  static async putUsers(id: string, { name, cpf }: Static<typeof updateUserData>) {
    try {
      return await db.user.update({
        where: {
          id: id
        },
        data: {
          cpf,
          name
        },
        omit: {
          password: true
        }
      })

    } catch (e) {
      console.error("Error: ", e);

    }
  }

  static async deleteUsers(id: string) {
    try {
      return await db.user.update({
        where: {
          id: id
        },
        data: {
          deleted: true
        },
        omit: {
          password: true
        }
      })
    } catch (e: unknown) {
      console.error(e);
    }
  }

  static async updateToken(userId: string, refreshToken: string) {
    const user = await db.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: refreshToken,
        isOnline: true,
      }
    })
    if (user.refreshToken === refreshToken) {
      return user
    }
    throw new Error("Erro ao atualizar o refreshToken")
  }
}