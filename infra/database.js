import { Client } from "pg";

async function query(queryObject) {
  const dbEnvironment = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  };
  const client = new Client(dbEnvironment);

  try {
    await client.connect();

    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    console.error(error);
    console.log("DB ENV: ", dbEnvironment);

    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query,
};
