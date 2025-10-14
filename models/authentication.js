import user from "models/user";
import password from "models/password";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findOneByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "User not authorized.",
        action: "Please check your credentials and try again.",
      });
    }
  }

  async function findOneByEmail(email) {
    try {
      const storedUser = await user.findOneByEmail(email);

      return storedUser;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Invalid email.",
          action: "Please check your credentials and try again.",
        });
      }
    }
  }

  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(providedPassword, storedPassword);

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Invalid password.",
        action: "Please check your credentials and try again.",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
