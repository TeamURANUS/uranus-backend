const admin = require("../utils/firebaseService");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
// https://firebase.google.com/docs/auth/web/start

const auth = getAuth();

const register = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.status(201).json({
        message: "user is created",
        data: user,
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(errorCode).json({
        message: errorMessage,
      });
    });
};

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  signInWithEmailAndPassword(auth, email, password)
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
      res.status(errorCode).json({
        message: errorMessage,
      });
    });
};

module.exports = {
  register,
  login,
};
