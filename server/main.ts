import { Hono } from "hono";
import { config } from "@config";
import * as db from "@db";

await db.init();

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

Deno.serve({
  port: config.server.port,
}, app.fetch);
