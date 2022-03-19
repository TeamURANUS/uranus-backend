const firebase = require("../utils/firedb");
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
        const allNews = await getAllNewsFromDB();

        if (allNews.empty) {
            res.status(404).json({
                messsage: "No New record found.",
            });
        } else {
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

const getNewsByAuthor = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const allNews = await getAllNewsFromDB();
        const userNews = allNews.filter(
            (x) => x.documentAuthor._key.path.segments[6] === userId
        );
        res.status(200).json(userNews);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllNewsFromDB = async () => {
    try {
        const allNews = [];

        const db = firestore.getFirestore(firebase);
        const newsDB = await firestore.collection(db, "news");
        const data = await firestore.getDocs(newsDB);

        if (!data.empty) {
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
        }
        return allNews;
    } catch (error) {
        return [];
    }
};

module.exports = {
    addNew,
    getAllNews,
    getNew,
    updateNew,
    deleteNew,
    getNewsByAuthor
};
