import { Elysia, t } from "elysia";
import { UserService } from "./service";

export const user = new Elysia({ prefix: '/user' })
  .state({
    user: {} as Record<string, string>,
    session: {} as Record<string, string>,
  })

const userRoutes = new Elysia({ prefix: '/users' })
  .get("/", () => UserService.getUsers(), {
    detail: {
      tags: ['User']
    }
  })
  .get("/:id", ({ params: { id }}) => UserService.getUserById(id), {
    detail: {
      tags: ['User']
    }
  })
  .post("/", ({ body }) => UserService.postUsers(body), {
    detail: {
      tags: ['User']
    },
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
      cpf: t.String()
    })
  })
  .put("/:id", ({ params: { id }, body}) => UserService.putUsers(id, body), {
    detail: {
      tags: ['User']
    },
    body: t.Object({
      name: t.String(),
      cpf: t.String()
    })
  })
  .delete("/:id", () => "user deleted", {
    detail: {
      tags: ['User']
    }
  })


export default userRoutes;