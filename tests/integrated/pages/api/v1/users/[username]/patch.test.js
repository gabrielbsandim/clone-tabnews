import { version as uuidVersion } from "uuid";

import password from "models/password.js";
import user from "models/user.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent user", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users/nonexistentuser", {
        method: "PATCH",
      });

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "User not found",
        action: "Please check the username and try again",
        status_code: 404,
      });
    });

    test("With duplicated username", async () => {
      await orchestrator.createUser({
        username: "user1",
      });

      await orchestrator.createUser({
        username: "user2",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "user1",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Username already in use",
        action: "Please use a different username",
        status_code: 400,
      });
    });

    test("With duplicated email", async () => {
      await orchestrator.createUser({
        email: "email1@example.com",
      });

      const createdUser2 = await orchestrator.createUser({
        email: "email2@example.com",
      });

      const response = await fetch(`http://localhost:3000/api/v1/users/${createdUser2.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "email1@example.com",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email already in use",
        action: "Please use a different email",
        status_code: 400,
      });
    });

    test("With unique username", async () => {
      const createdUser = await orchestrator.createUser({
        username: "uniqueUser1",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/uniqueUser1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "uniqueUser2",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "uniqueUser2",
        email: createdUser.email,
        features: [],
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(responseBody.updated_at > createdUser.updated_at.toISOString()).toBe(true);
    });

    test("With unique email", async () => {
      const createdUser = await orchestrator.createUser({
        email: "uniqueemail1@example.com",
      });

      const response = await fetch(`http://localhost:3000/api/v1/users/${createdUser.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "uniqueemail2@example.com",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: createdUser.username,
        email: "uniqueemail2@example.com",
        features: [],
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(responseBody.updated_at > createdUser.updated_at.toISOString()).toBe(true);
    });

    test("With new password", async () => {
      const createdUser = await orchestrator.createUser({
        password: "password123",
      });

      const response = await fetch(`http://localhost:3000/api/v1/users/${createdUser.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: "newpassword456",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        features: [],
        password: responseBody.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(responseBody.updated_at > createdUser.updated_at.toISOString()).toBe(true);

      const userInDatabase = await user.findOneByUsername(createdUser.username);

      const correctPasswordMatch = await password.compare(
        "newpassword456",
        userInDatabase.password,
      );

      const incorrectPasswordMatch = await password.compare("password123", userInDatabase.password);

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
