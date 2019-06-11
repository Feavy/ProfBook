const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp();

exports.addUser = functions.region("europe-west1").auth.user().onCreate((user, context) => {
    admin.firestore().collection("users").doc(user.uid).create({name: user.email.split("@")[0], role: 'etudiant'});
});