//step 1 - define the web scraper

//importing the scraper
const cheerio = require("cheerio");

//testing
let stockTicker = "MRNA";
let type = "history";

async function scrapeData() {
  try {
    //step a - fetch the html page & getting the html result
    const url = `https://finance.yahoo.com/quote/${stockTicker}/${type}/`;
    const res = await fetch(url);
    const html = await res.text();
    console.log(html);

    const $ = cheerio.load(html);
    const price_history = getPrices($);
    console.log(price_history);
  } catch (err) {
    console.log(err.message);
  }
}

function getPrices(cher) {
  const prices = cher("td:nth-child(6)")
    .get()
    .map((current_value) => {
      return cher(current_value).text();
    });
  return prices;
}
scrapeData();
//step 2 - initialize server that serves up an html file that the user can play with

//step 3 - define api endpoints to access stock data (and call webscaper)
