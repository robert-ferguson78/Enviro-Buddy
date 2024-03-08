/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const { getAnalyticsByBrand } = require("../src/utils/analytics.js");

exports.updateAnalyticsOnCountyAddOrDelete = functions.firestore
    .document("counties/{countyId}")
    .onCreate(async (snap, context) => {
    // Update the analytics collection
      await getAnalyticsByBrand(snap.data().userId);
    });

exports.updateAnalyticsOnCountyDelete = functions.firestore
    .document("counties/{countyId}")
    .onDelete(async (snap, context) => {
    // Update analytics collection
      await getAnalyticsByBrand(snap.data().userId);
    });

exports.updateAnalyticsOnDealerAddOrDelete = functions.firestore
    .document("dealers/{dealerId}")
    .onCreate(async (snap, context) => {
    // Update analytics collection
      await getAnalyticsByBrand(snap.data().userId);
    });

exports.updateAnalyticsOnDealerDelete = functions.firestore
    .document("dealers/{dealerId}")
    .onDelete(async (snap, context) => {
    // Update the analytics collection
      await getAnalyticsByBrand(snap.data().userId);
    });
