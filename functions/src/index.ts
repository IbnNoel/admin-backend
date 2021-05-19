import * as functions from "firebase-functions";
import admin = require("firebase-admin");


const cors = require("cors")({origin: true});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);


export const deleteUser = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    if (request.method === "DELETE") {
      // https://us-central1-gasproject-2f4cb.cloudfunctions.net/deleteUser?uid=iT4psHvRbtaQdynHG254RRTdb9c2
      const userUid = request.query.uid;
      // Delete user record from Authentication
      admin.auth().deleteUser(`${userUid}`)
          .then(function(result) {
            response.status(200).json(userUid);
            console.log("User Authentication record deleted");
          })
          .catch((err) => {
            response.status(500).send(err);
            console.error("Error while trying to delete the user", err);
          });
    } else {
      response.status(500).send("THE METHOD SHOULD BE \"DELETE\" METHOD");
    }
  });
});

export const disabledUser = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    if (request.method === "PATCH") {
      // https://us-central1-gasproject-2f4cb.cloudfunctions.net/deleteUser?uid=iT4psHvRbtaQdynHG254RRTdb9c2
      const userUid = request.query.uid;
      // Delete user record from Authentication
      admin.auth().updateUser(`${userUid}`, {disabled: true})
          .then(function(result) {
            response.status(200).json(userUid);
            console.log("User disabled");
          })
          .catch((err) => {
            response.status(500).send(err);
            console.error("Error while trying to disable the user", err);
          });
    } else {
      response.status(500).send("THE METHOD SHOULD BE \"PATCH\" METHOD");
    }
  });
});
