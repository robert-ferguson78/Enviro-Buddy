import dotenv from "dotenv";

// import { readFile } from "node:fs/promises";

import { initializeApp, applicationDefault, cert } from "firebase-admin/app";

import { getFirestore, Timestamp, FieldValue, Filter } from "firebase-admin/firestore";

dotenv.config();

// const fileUrl = new URL("../../config/envirobuddykey.json", import.meta.url);
// const serviceAccount = JSON.parse(await readFile(fileUrl, "utf8"));

initializeApp({
  credential: cert(
    {
      "type": process.env.FBtype,
      "project_id": process.env.FBproject_id,
      "private_key_id": process.env.FBprivate_key_id,
      "private_key": process.env.FBprivate_key,
      "client_email": process.env.FBclient_email,
      "client_id": process.env.FBclient_id,
      "auth_uri": process.env.FBauth_uri,
      "token_uri": process.env.FBtoken_uri,
      "auth_provider_x509_cert_url": process.env.FBauth_provider_x509_cert_url,
      "client_x509_cert_url": process.env.FBclient_x509_cert_url,
      "universe_domain": process.env.FBuniverse_domain
    }
  )
});

const db = getFirestore();

export { db };