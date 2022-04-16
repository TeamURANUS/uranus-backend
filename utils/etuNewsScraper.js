const rp = require('request-promise');
const cheerio = require('cheerio');
const firebase = require("../utils/firedb");
const firestore = require("firebase/firestore/lite");
const logger = require("./logger");
const {toBase64} = require("request/lib/helpers");
const url = 'https://www.etu.edu.tr/tr/haberler';
const baseurl = 'https://www.etu.edu.tr'

const latestNewScrapper = () => {
    rp(url)
        .then(function(html){
            // success situation:
            let $ = cheerio.load(html);
            let latestLink = baseurl + $('main > div > div > button', html)[0].attribs.onclick.split('\'')[1];
            let latestImgLink = baseurl + $('main > div > img', html)[0].attribs['data-src'];

            rp(latestLink)
                .then(function(html){
                    // success situation:
                    let $ = cheerio.load(html);
                    let content = $(".haber_icerik").text();
                    let title = $(".featured_header__detail__large_text").text();
                    let date = $(".featured_header__detail__time").text();

                    addNewScraper(date, content, title, latestLink, latestImgLink).then(r => console.log("scraped"));
                })
                .catch(function(err){
                    // error situation:
                    console.log(err);
                    console.log("Got error while scraping news.")
                });

        })
}

const addNewScraper = async (date, content, title, link, imgLink) => {
    const data = {
            "documentAuthor": "TOBB ETU",
            "documentContent": [
                imgLink,
                content
            ],
            "documentDate": date,
            "documentId": link,
            "documentTitle": title
    };


    const db = firestore.getFirestore(firebase);
    const newsDB = firestore.doc(db, "news", toBase64(link));

    await firestore.setDoc(newsDB, data);
};

const subNewScrapper = () => {
    rp(url)
        .then(function(html){
            // success situation:
            let $ = cheerio.load(html);
            let numOfArticles = $('article > a', html).length;

            for(let i=0; i<numOfArticles; i++){
                let articleLink = baseurl + $('article > a', html)[i].attribs.href;
                let articleImgLink = baseurl + $('article > a > figure > div > img', html)[i].attribs.src;


                rp(articleLink)
                    .then(function(html){
                        // success situation:
                        let $ = cheerio.load(html);
                        let content = $(".haber_icerik").text();
                        let title = $(".featured_header__detail__large_text").text();
                        let date = $(".featured_header__detail__time").text();

                        addNewScraper(date, content, title, articleLink, articleImgLink).then(r => console.log("scraped"));
                    })
                    .catch(function(err){
                        // error situation:
                        console.log(err);
                        console.log("Got error while scraping news.")
                    });

            }


        })
        .catch(function(err){
            // error situation:
            console.log(err);
            console.log("Got error while scraping news.")
        });
}

module.exports = {
    latestNewScrapper,
    subNewScrapper,
    addNewScraper
}
