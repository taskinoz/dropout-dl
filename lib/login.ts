import { file } from "bun";
import { error } from "./log";

export async function getCredentials(): Promise<{
  DROPOUT_EMAIL: string;
  DROPOUT_PASSWORD: string;
}> {
  const login = file("login.json");
  if (await login.exists()) {
    const { email: DROPOUT_EMAIL, password: DROPOUT_PASSWORD } =
      await login.json();
    return { DROPOUT_EMAIL, DROPOUT_PASSWORD };
  }

  // Get credentials from params -u <email> -p <password>
  const args = process.argv.slice(2);
  const emailIndex = args.indexOf("-u");
  const passwordIndex = args.indexOf("-p");
  if (emailIndex !== -1 && passwordIndex !== -1) {
    const DROPOUT_EMAIL = args[emailIndex + 1];
    const DROPOUT_PASSWORD = args[passwordIndex + 1];

    if (
      typeof DROPOUT_EMAIL !== "string" ||
      typeof DROPOUT_PASSWORD !== "string"
    ) {
      error("Both email and password must be provided.");
    }

    return {
      DROPOUT_EMAIL: DROPOUT_EMAIL as string,
      DROPOUT_PASSWORD: DROPOUT_PASSWORD as string,
    };
  }

  error("No valid login credentials found");
  return Promise.reject(new Error("No valid login credentials found"));
}
