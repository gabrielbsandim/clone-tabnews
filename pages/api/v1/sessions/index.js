import { createRouter } from "next-connect";
import * as cookie from "cookie";

import controller from "infra/controller.js";
import authentication from "models/authentication";
import session from "models/session";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  const createdSession = await session.create(authenticatedUser.id);

  const setCookie = cookie.serialize("session_id", createdSession.token, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILISECONDS / 1000, // in seconds
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);

  return response.status(201).json(createdSession);
}
