import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { addressSchema } from "../../shared/schemas";
import { StubProvider } from "../services/address-validation";
import type { Env } from "../../env.d.ts";

const addressRouter = new Hono<{ Bindings: Env }>();

// POST /api/address/validate
addressRouter.post("/validate", zValidator("json", addressSchema), async (c) => {
  const address = c.req.valid("json");
  const provider = new StubProvider();
  const result = await provider.validate(address);
  return c.json(result);
});

export default addressRouter;
