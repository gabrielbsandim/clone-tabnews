import { Client } from "pg";
import sslCert from "infra/scripts/sslCert";

async function query(queryObject) {
  const ssl = await getSSLValues();

  const dbEnvironment = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl,
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

async function getSSLValues() {
  if (process.env.NODE_ENV === "development") {
    return { rejectUnauthorized: false };
  }

  const cert = await sslCert.handleGetCert();

  if (cert) {
    return {
      ca: cert,
    };
  }

  return true;
}

export default {
  query,
};
