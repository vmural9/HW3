import { chromium } from "playwright";
import { describe, expect, beforeAll, afterAll, test } from "vitest";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import "dotenv/config";

let browser;
let page;
let uid1;
let uid2;
let auth;

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (process.env.EMULATOR) {
  console.log("Emulator Setting Up");
  process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
  process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

auth = getAuth(app);

async function createUserWithEmail(email) {
  console.log(await page.url());
  await page.fill("#name", "Test User");
  await page.fill("#email", email);
  await page.fill("#password", "CITestingWithFirebaseEmulator");
  await page.click("#createUserButton");

  console.log(await page.url());

  await page.fill("#emailId", email);
  await page.fill("#password", "CITestingWithFirebaseEmulator");
  await page.click("#loginButton");
  await page.waitForNavigation();
  console.log(await page.url());

  const dump = await auth.listUsers();
  let uid;
  for (const user of dump.users) {
    if (user.email === email) {
      uid = user.uid;
      break;
    }
  }
  return uid;
}

beforeAll(async () => {
  console.log("Spawning!");
  try {
    browser = await chromium.launch();
    page = await browser.newPage();
    const emulatorHost = "http://127.0.0.1:8080";
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const deleteCollectionUrl = `${emulatorHost}/emulator/v1/projects/${projectId}/databases/(default)/documents/chatHistory/testinguser@test.com`;
    const deleteCollectionUrl2 = `${emulatorHost}/emulator/v1/projects/${projectId}/databases/(default)/documents/chatHistory/testinguser2@test.com`;

    await fetch(deleteCollectionUrl, {
      method: "DELETE",
    });
    await fetch(deleteCollectionUrl2, {
      method: "DELETE",
    });
    await page.goto("http://localhost:3000/register");
    uid1 = await createUserWithEmail("testinguser@test.com");
  } catch (error) {
    throw new Error(error);
  }
  // page.on("console", (message) => {
  //   console.log(`Console [${message.type()}]: ${message.text()}`);
  // });
});

afterAll(async () => {
  await auth.deleteUser(uid1);
  await auth.deleteUser(uid2);
});

describe("Check the functionality of Serverless GPT-484", () => {
  test("(3 pts) 1. Create a new prompt, and it should appear in the history.", async () => {
    await page.fill("#inputField", "New Prompt 1");
    await page.click("#submit");
    await page.waitForTimeout(1500);
    await page.waitForSelector(".history");

    const listItems = await page.$$eval(".history li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );
    const foundItem = listItems.includes("New Prompt 1");
    expect(foundItem).toBe(true);
  });

  test("(3 pts) 2. Create a new prompt, and it should appear in the history. Creation of a new prompt under the same parent should not create a new entry in the history section.", async () => {
    await page.waitForSelector(".history");
    const listItems = await page.$$eval(".history li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );

    console.log(listItems);
    const foundItem = listItems.includes("New Prompt 1");
    expect(foundItem).toBe(true);

    await page.fill("#inputField", "New Prompt inside same parent");
    await page.click("#submit");
    await page.waitForTimeout(1500);

    const updatedListItems = await page.$$eval("#history-pane li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );
    expect(updatedListItems.includes("New Prompt inside same parent")).toBe(
      false
    );
  });

  test("(3 pts) 3. Checking chats under the same parent in the viewing pane", async () => {
    await page.waitForSelector(".feed");
    const viewListItems = await page.$$eval(".feed li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );

    expect(viewListItems.length).toBe(4);
    expect(viewListItems.includes("User:New Prompt inside same parent")).toBe(
      true
    );
  });

  test("(4 pts) 4. Clicking the New Chat button and creating a new prompt should add an entry in history", async () => {
    await page.click("#newChat");
    await page.fill("#inputField", "New Prompt 2");
    await page.click("#submit");
    await page.waitForTimeout(1500);

    const historyListItems = await page.$$eval(".history li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );
    expect(historyListItems.includes("New Prompt 2")).toBe(true);
  });

  test("(7 pts) 5. Reload the page and check history and chats", async () => {
    // Reload the page
    await page.reload();
    await page.waitForTimeout(1500);
    await page.waitForSelector(".history");
    const historyListItems = await page.$$eval(".history li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );

    // console.log(historyListItems);
    const totalEntriesInHistory = historyListItems.length;
    expect(totalEntriesInHistory).equals(2);

    const newPrompt1Element = await page.$(
      '.history li:has-text("New Prompt 1")'
    );
    if (newPrompt1Element) {
      await newPrompt1Element.click();
    } else {
      throw new Error("Item 'New Prompt 1' not found in history");
    }

    await page.waitForSelector(".feed");
    const viewListItems = await page.$$eval(".feed li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );

    console.log(viewListItems);
    expect(viewListItems.includes("USER:New Prompt inside same parent")).toBe(
      true
    );
  });

  test("(10 pts) 6. Logout and create a new Email account and check functionality", async () => {
    await page.click("#logout");
    console.log("Logout Done");
    await page.goto("http://localhost:3000/register", {
      waitUntil: "networkidle",
    });
    console.log("Navigation Done");
    uid2 = await createUserWithEmail("testinguser2@test.com");

    console.log("UID Generated");
    let listItems = await page.$$eval(".history li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );

    expect(listItems.length).equal(0);

    await page.fill("#inputField", "New Prompt under Email 2");
    await page.click("#submit");
    await page.waitForSelector(".history");

    listItems = await page.$$eval(".history li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );

    const foundItem = listItems.includes("New Prompt under Email 2");
    expect(foundItem).toBe(true); // Check if foundItem is true

    await page.waitForSelector(".feed");
    const viewListItems = await page.$$eval(".feed li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );

    expect(viewListItems.length).toBe(2);
    expect(viewListItems.includes("User:New Prompt under Email 2")).toBe(true);

    await page.click("#logout");
    await page.goto("http://localhost:3000/signin");
    await page.fill("#emailId", "testingUser@test.com");
    await page.fill("#password", "CITestingWithFirebaseEmulator");
    await page.click("#loginButton");
    await page.waitForNavigation({ waitUntil: "networkidle" });
    await page.waitForSelector(".history");

    listItems = await page.$$eval(".history li", (elements) =>
      elements.map((item) => item.textContent.trim())
    );

    expect(listItems.length).equal(2);
    expect(listItems.includes("New Prompt 2")).toBe(true);
  });
});
