//step 1 - define the web scraper

//importing the scraper
const cheerio = require("cheerio");

//testing
let stockTicker = "MRNA";
let type = "history";

async function scrapeData(ticker) {
  try {
    //step a - fetch the html page & getting the html result
    const url = `https://finance.yahoo.com/quote/${ticker}/${type}?p=${ticker}`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const price_history = getPrices($);
    console.log(price_history);
    return price_history;
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

//step 2 - initialize server that serves up an html file that the user can play with

//loading the express library
const express = require("express");
//invoking express on port 8383
const app = express();
const port = 8383;

//listen to incoming requests on port 8383
app.listen(port, () => console.log(`Server has started on port: ${port}`));

//middleware - settings of the server
app.use(express.json());
//enabling cors
app.use(require("cors")());
//when someone accesses our server on the browser its going to give them the index.html file in the public folder
app.use(express.static("public"));

//step 3 - define api endpoints to access stock data (and call webscaper)

//defining endpoints
app.post(`/api`, async (req, res) => {
  const { stock_ticker: ticker } = req.body;
  console.log(ticker);
  const prices = await scrapeData(ticker);
  res.status(200).send({ prices });
});
