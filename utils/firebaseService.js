const admin = require("firebase-admin");

const { serviceAccount } = require("./config");

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
});

module.exports = admin;
