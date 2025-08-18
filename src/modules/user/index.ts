import { Elysia } from "elysia";
import { UserService } from "./service";
import { UserModel } from "./model";
import { AuthPlugin } from "../auth/plugin";
import { Logger } from "src/utils/logger";

const userRoutes = new Elysia({ prefix: '/users' })
  .use(AuthPlugin)
  .use(UserModel)
  .decorate("logger", new Logger())
  .post("/", ({ body }) => UserService.postUsers(body), {
    detail: {
      tags: ['User']
    },
    body: "createUser"
  })
  .get("/:id", ({ params: { id } }) => UserService.getUserById(id), {
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
  .get("/me", ({ user }) => 
    ({
      message: "Fetch current user",
      data: {
        user
      }
    }),
    {
      detail: {
      tags: ['User']
    }
  })


export default userRoutes;