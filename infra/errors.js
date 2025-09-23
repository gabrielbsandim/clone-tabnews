export class InternalServerError extends Error {
  constructor({ statusCode, cause }) {
    super("An unexpected error occurred.", { cause });
    this.name = "InternalServerError";
    this.action = "Try again later. If the problem persists, contact support.";
    this.status_code = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service unavailable at the moment.", { cause });
    this.name = "ServiceError";
    this.action = "Try again later. If the problem persists, contact support.";
    this.status_code = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class MethodNotAllowedErrorError extends Error {
  constructor() {
    super("Method not allowed for this endpoint.");
    this.name = "MethodNotAllowedError";
    this.action = "Check if you are using the correct HTTP method.";
    this.status_code = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}
