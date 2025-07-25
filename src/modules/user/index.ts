import { Elysia } from "elysia";
import { UserService } from "./service";
import { UserModel } from "./model";

const userRoutes = new Elysia({ prefix: '/users' })
  .post("/", ({ body }) => UserService.postUsers(body), {
    detail: {
      tags: ['User']
    },
    body: UserModel.createUser
  })
  // .get("/", () => UserService.getUsers(), {
  //   detail: {
  //     tags: ['User']
  //   },
  //   encodeSchema: true
  // })
  .get("/:id", ({ params: { id } }) => UserService.getUserById(id), {
    detail: {
      tags: ['User']
    }
  })
  .put("/:id", ({ params: { id }, body }) => UserService.putUsers(id, body), {
    detail: {
      tags: ['User']
    },
    body: UserModel.updateUserData
  })
  .delete("/:id", ({ params: { id } }) => UserService.deleteUsers(id), {
    detail: {
      tags: ['User']
    }
  })


export default userRoutes;