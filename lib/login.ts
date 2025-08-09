import {file} from "bun";

export async function getCredentials(): Promise<{ DROPOUT_EMAIL: string; DROPOUT_PASSWORD: string }> {
    const login = file('login.json')
    if (await login.exists()){
        const { email: DROPOUT_EMAIL, password: DROPOUT_PASSWORD } =
            await login.json();
        return { DROPOUT_EMAIL, DROPOUT_PASSWORD };
    }

    // Get credentials from params -u <email> -p <password>
    const args = process.argv.slice(2);
    const emailIndex = args.indexOf("-u");
    const passwordIndex = args.indexOf("-p");
    if (emailIndex !== -1 && passwordIndex !== -1) {
        const DROPOUT_EMAIL = args[emailIndex + 1]
        const DROPOUT_PASSWORD = args[passwordIndex + 1]

        if (!DROPOUT_EMAIL || !DROPOUT_PASSWORD) {
            throw new Error("Both email and password must be provided.");
        }

        return { DROPOUT_EMAIL, DROPOUT_PASSWORD };
    }

    throw new Error("No valid login credentials found");
}
