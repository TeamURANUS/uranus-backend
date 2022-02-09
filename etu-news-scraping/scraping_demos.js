const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://www.etu.edu.tr/tr/haberler';
const baseurl = 'https://www.etu.edu.tr'


// Just doin' some experiments.
// Now can scrape all news (except the latest one, will work on that).
// It returns article's link and relevant image's link. Which is enough I guess.

// TODO:
// Scrape the latest new.
// Fix the return format.

rp(url)
    .then(function(html){
        // success situation:
        let $ = cheerio.load(html);
        let numOfArticles = $('article > a', html).length;

        for(let i=0; i<numOfArticles; i++){
            let articleLink = baseurl + $('article > a', html)[i].attribs.href;
            let articleImgLink = baseurl + $('article > a > figure > div > img', html)[i].attribs.src;


            console.log("---------------------");
            console.log("Article: " + articleLink);
            console.log("Article Img: " + articleImgLink);
            console.log("---------------------");

        }


    })
    .catch(function(err){
        // error situation:
        console.log(err);
        console.log("got error you ***** of ****.")
    });