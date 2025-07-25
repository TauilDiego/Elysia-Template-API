import db from "../../utils/db"
import { AuthModel } from "./model";
import { UserModel } from "../user/model";

abstract class AuthService {
    static async login({ email, password }: AuthModel.login) {
        try {
            const user = await db.user.findFirst({
                where: {
                    email: email
                },
            })
            if (!user) throw new Error("User not found")
            const passwordMatch = await Bun.password.verify(password, user.password)



        } catch (e: unknown) {
            console.error(e);
        }

    }
}
