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

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "A validation error occurred.", { cause });
    this.name = "ValidationError";
    this.action = action || "Please correct the sent data and try again.";
    this.status_code = 400;
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

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "It was not possible to find this resource.", { cause });
    this.name = "NotFoundError";
    this.action = action || "Please correct the sent data and try again.";
    this.status_code = 404;
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

export class UnauthorizedError extends Error {
  constructor({ cause, message, action }) {
    super(message || "User not authorized.", { cause });
    this.name = "UnauthorizedError";
    this.action = action || "Please check your credentials and try again.";
    this.status_code = 401;
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
