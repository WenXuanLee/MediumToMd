// request for send request 
const request = require("request")
// cheerio for parse HTML Dom
const cheerio = require('cheerio');
const Markdown = require('./markdown');

const mediumArticleUrl = 'https://medium.com/@speechless0922/vue%E7%9A%84%E4%BA%8C%E4%B8%89%E4%BA%8B-render-function-2b3705e4a5bd';

request(mediumArticleUrl, (error, response, body) => {
  // body for cheerio
  const $ = cheerio.load(body);

  /* let markdown js handle the transform logic */
  const markdown = new Markdown($);
  markdown.showBody()

 
});