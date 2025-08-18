import Elysia from "elysia";
import { Logger } from "src/utils/logger";

const publicRoutes = new Elysia()
    .decorate("logger", new Logger())
    .get("status", ({ logger }) => {
        logger.log("passando aqui")

        return {
            message: "bom dia diego"
        }
    })

export default publicRoutes;