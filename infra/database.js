import { Client } from "pg";
import { ServiceError } from "./errors";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();

    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Error in database connection or query.",
      cause: error,
    });

    throw serviceErrorObject;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const dbEnvironment = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  };

  const client = new Client(dbEnvironment);

  await client.connect();

  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
