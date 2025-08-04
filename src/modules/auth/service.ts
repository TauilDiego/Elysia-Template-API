export abstract class AuthService {
    static async verifyPassword( userPassword: string  , typedPassword: string ) {
        return await Bun.password.verify(typedPassword, userPassword)
    }
}
