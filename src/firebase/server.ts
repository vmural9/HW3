import type { ServiceAccount } from "firebase-admin";
import { initializeApp, cert } from "firebase-admin/app";

console.log(import.meta.env.FIREBASE_PROJECT_ID);
const serviceAccount = {
  type: "service_account",
  project_id: import.meta.env.FIREBASE_PROJECT_ID,
  private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: import.meta.env.FIREBASE_PRIVATE_KEY,
  client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
  client_id: import.meta.env.FIREBASE_CLIENT_ID,
  auth_uri: import.meta.env.FIREBASE_AUTH_URI,
  token_uri: import.meta.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
};

if (import.meta.env.EMULATOR) {
  console.log("Emulator Setting Up");
  process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
  process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
}

export const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});
