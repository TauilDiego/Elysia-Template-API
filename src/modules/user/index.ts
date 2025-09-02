import { Elysia } from "elysia";
import { UserService } from "./service";
import { UserModel } from "./model";
import { Logger } from "@/utils/logger";

const userRoutes = new Elysia({ prefix: '/users' })
  .use(UserModel)
  .decorate("logger", new Logger())
  .post("/", ({ body }) => UserService.postUsers(body), {
    detail: {
      tags: ['User']
    },
    body: "createUser"
  })
  .get("/:id", ({ params: { id } }) => {
    return UserService.getUserById(id)
  }, {
    detail: {
      tags: ['User']
    }
  })
  .put("/:id", ({ params: { id }, body }) => UserService.putUsers(id, body), {
    detail: {
      tags: ['User']
    },
    body: "updateUserData"
  })
  .delete("/:id", ({ params: { id } }) => UserService.deleteUsers(id), {
    detail: {
      tags: ['User']
    }
  })


export default userRoutes;