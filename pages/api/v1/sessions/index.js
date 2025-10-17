import { createRouter } from "next-connect";

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

  await controller.setSessionCookie(createdSession.token, response);

  return response.status(201).json(createdSession);
}
