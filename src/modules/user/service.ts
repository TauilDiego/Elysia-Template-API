import db from "../../utils/db"
import * as bun from "bun";
import { UserModel } from "./model";

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

  static async getUserById(id: string) {
    try {
      return await db.user.findFirst({
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

  static async getUserByEmail(email: string,) {
     try {
      return await db.user.findFirst({
        where: {
          email: email
        },
        omit: {
          password: true
        }
      })
    } catch (e: unknown) {
      console.error(e)
    }
  }

  static async postUsers({ email, password, name, cpf }: ) {
    try {
      return await db.user.create({
        data: { email, name, cpf, password: await bun.password.hash(password) } ,
        omit: { password: true }
      });
    } catch (e: unknown) {
      console.error(e)
    }
  }

  static async putUsers(id: string, { name, cpf }: UserModel.updateUserData) {
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
    } catch(e: unknown) {
      console.error(e);
    }
  }
}