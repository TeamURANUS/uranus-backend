const admin = require("../utils/firebaseService");
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
        console.log(error); // TODO
      });

      res.status(201).json({
        message: "user is created",
        data: user,
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
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
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(500).json({
        //TODO
        message: errorMessage,
      });
    });
};

const resetPassword = async (req, res, next) => {
  const receiverMail = req.body.email;
  sendPasswordResetEmail(auth, receiverMail)
    .then((a) => {
      console.log(a);
      res.status(200).json({ message: "Reset password mail sent" });
    })
    .catch((error) => {
      console.log(error.code);
      res.status(500).json({ message: error.code });
    });
};

module.exports = {
  register,
  login,
  resetPassword,
};
