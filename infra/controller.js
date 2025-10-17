import * as cookie from "cookie";

import {
  MethodNotAllowedErrorError,
  InternalServerError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from "infra/errors";
import session from "models/session";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedErrorError();

  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.status_code).json(error);
  }

  if (error instanceof UnauthorizedError) {
    clearSessionCookie(response);
    return response.status(error.status_code).json(error);
  }

  const publicErrorObject = new InternalServerError({ cause: error });

  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

async function setSessionCookie(sessionToken, response) {
  const setCookie = cookie.serialize("session_id", sessionToken, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000, // in seconds
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

async function clearSessionCookie(response) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  clearSessionCookie,
  setSessionCookie,
};

export default controller;
