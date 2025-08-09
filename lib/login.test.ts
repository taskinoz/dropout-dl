import {test, expect} from 'bun:test';
import { getCredentials } from "./login";
import { file, write } from 'bun';

test("getCredentials throws error when file is missing", async () => {
    await expect(getCredentials()).rejects.toThrow();
});

test("getCredentials from file returns correct values", async () => {
    // Create login
    const login = {
        email: "your_email@example.com",
        password: "your_password"
    };

    const expected = {
        DROPOUT_EMAIL: "your_email@example.com",
        DROPOUT_PASSWORD: "your_password"
    }

    await write('login.json', JSON.stringify(login));
    expect(await getCredentials()).toEqual(expected);
    await file('login.json').delete();
});