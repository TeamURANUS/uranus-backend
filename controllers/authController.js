const admin = require("../utils/firebaseService");
const logger = require("../utils/logger");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} = require("firebase/auth");
// https://firebase.google.com/docs/auth/web/start

const auth = getAuth();

const register = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      sendEmailVerification(user).catch((error) => {
        logger.error(error);
      });

      res.status(201).json({
        message: "user is created",
        data: user,
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      logger.error(errorMessage);
      res.status(500).json({
        message: errorMessage,
      });
    });
};

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.status(200).json({
        message: "user is found",
        data: user,
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      logger.error(errorMessage);
      res.status(500).json({
        message: errorMessage,
      });
    });
};

const resetPassword = async (req, res, next) => {
  const receiverMail = req.body.email;
  sendPasswordResetEmail(auth, receiverMail)
    .then((a) => {
      res.status(200).json({ message: "Reset password mail sent" });
    })
    .catch((error) => {
      const errorMessage = error.message;
      logger.error(errorMessage);
      res.status(500).json({ message: error.code });
    });
};

module.exports = {
  register,
  login,
  resetPassword,
};
