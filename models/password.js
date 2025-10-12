import bcrypt from "bcryptjs";

async function hash(password) {
  const saltRounds = getNumberOfHashingRounds();

  return await bcrypt.hash(password, saltRounds);
}

function getNumberOfHashingRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedHashedPassword) {
  return await bcrypt.compare(providedPassword, storedHashedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
