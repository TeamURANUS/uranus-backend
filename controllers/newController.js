const firebase = require("../firedb");
const firestore = require("firebase/firestore/lite");
const New = require("../models/new");

const addNew = async (req, res, next) => {
    try {
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const newsDB = firestore.collection(db, "news");
        await firestore.addDoc(newsDB, data);
        res.status(201).json({
            message: "New added successfully!",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const getAllNews = async (req, res, next) => {
    try {
        const allNews = [];

        const db = firestore.getFirestore(firebase);
        const newsDB = await firestore.collection(db, "news");
        const data = await firestore.getDocs(newsDB);

        if (data.empty) {
            res.status(404).json({
                messsage: "No New record found.",
            });
        } else {
            data.forEach((doc) => {
                const _new = new New(
                    doc.id,
                    doc.data().documentAuthor,
                    doc.data().documentContent,
                    doc.data().documentDate,
                    doc.data().documentId,
                    doc.data().documentTags,
                    doc.data().documentTitle,
                );
                allNews.push(_new);
            });
            res.status(200).json({
                data: allNews,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getNew = async (req, res, next) => {
    try {
        const newId = req.params.newId;
        const db = firestore.getFirestore(firebase);
        const _new = await firestore.doc(db, "news", newId);
        const data = await firestore.getDoc(_new);

        if (data.empty) {
            res.status(404).json({
                message: "New with given ID cannot be found.",
            });
        } else {
            res.status(200).json({
                data: data.data(),
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateNew = async (req, res, next) => {
    try {
        const newId = req.params.newId;
        const data = req.body;
        const db = firestore.getFirestore(firebase);
        const _new = await firestore.doc(db, "news", newId);
        await firestore.updateDoc(_new, data);

        res.status(200).json({
            message: "New record has updated successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteNew = async (req, res, next) => {
    try {
        const newId = req.params.newId;
        const db = firestore.getFirestore(firebase);
        const _new = await firestore.doc(db, "news", newId);
        await firestore.deleteDoc(_new);

        res.status(200).json({
            message: "New record has been deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addNew,
    getAllNews,
    getNew,
    updateNew,
    deleteNew,
};