import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync('./ecommerce-7f05b-firebase-adminsdk-me8je-6a724c0218.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const ad = admin;
