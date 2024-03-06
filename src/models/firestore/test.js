import { doc, setDoc } from "firebase-admin/firestore";
import { db } from "./connect.js";

async function testDB() {
  const docRef = doc(db, "testCollection", "testDocument");

  await setDoc(docRef, {
    testField: "testValue"
  });

  console.log("Document written with ID: ", docRef.id);
}

testDB().catch(console.error);