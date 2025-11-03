import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

describe("infra/email.js", () => {
  beforeAll(async () => {
    await orchestrator.waitForAllServices();
  });

  afterAll(async () => {
    await orchestrator.deleteAllEmails();
  });

  test("send", async () => {
    await email.send({
      from: "Gabriel <gabriel.bsandim@gmail.com>",
      to: "gabriel.bsandim@outlook.com",
      subject: "Test email",
      text: "This is a test email sent from Clone Tabnews.",
    });

    await email.send({
      from: "Last <lastemailsender@gmail.com>",
      to: "lastemailrecipient@outlook.com",
      subject: "Test last email",
      text: "This is the last test email sent from Clone Tabnews.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<lastemailsender@gmail.com>");
    expect(lastEmail.recipients[0]).toBe("<lastemailrecipient@outlook.com>");
    expect(lastEmail.subject).toBe("Test last email");
    expect(lastEmail.text).toBe("This is the last test email sent from Clone Tabnews.\n");
  });
});
