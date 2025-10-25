import { Elysia, file } from "elysia";

const app = new Elysia()
  .get("/", "Hello Elysia")
  .get("/hello/:someone", ({ params: { someone } }) => `Hello, ${someone}!`)
  .get("/blob", file("blob.txt"))
  .get("/user/:id", ({ params: { id } }) => id)
  .post("/form", ({ body }) => body);

export default app;
