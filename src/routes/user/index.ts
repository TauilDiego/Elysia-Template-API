import { Elysia} from "elysia";
import {getUsers, postUsers} from "./handler";

const userRoutes = new Elysia({ prefix: '/users' })
  .get("/", () => getUsers())
  .get("/:id", () => "user data")
  .post("/", ({ body }) => postUsers(body))
  .put("/:id", () => "user updated")
  .delete("/:id", () => "user deleted")

export default userRoutes;