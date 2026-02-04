import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () => {
  test("Create user account", async () => {
    const createUserResponse = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "RegistrationFlow",
        email: "registrationflow@example.com",
        password: "RegistrationFlowPassword",
      }),
    });

    expect(createUserResponse.status).toBe(201);

    const createUserData = await createUserResponse.json();
    expect(createUserData).toHaveProperty("id");
    expect(createUserData).toHaveProperty("username", "RegistrationFlow");
    expect(createUserData).toHaveProperty("email", "registrationflow@example.com");
  });

  test("Receive activation email", async () => {});

  test("Activate user account", async () => {});

  test("Login with activated account", async () => {});

  test("Get user data", async () => {});
});
