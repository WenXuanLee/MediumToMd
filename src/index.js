// request for send request 
const request = require("request")
// cheerio for parse HTML Dom
const cheerio = require('cheerio');
const MarkdownTransformer = require('./markdown');
const path = require('path');

const mediumArticleUrl = 'https://medium.com/@speechless0922/review-javascript-this-%E7%B9%AB%E7%B5%90%E7%B6%81%E5%AE%9A-5b3907c9c9bc';

request(mediumArticleUrl, (error, response, body) => {
  // body for cheerio
  const $ = cheerio.load(body);

  // let markdown js handle the transform logic 
  const markdown = new MarkdownTransformer($);
  
  // set my target folder to 
  // SideProjects/hugo-resources/WenXuanLee/content/Posts/mediumPosts
  // and create markdown file
  markdown.outputResult(path.resolve('../hugo-resource/WenXuanLee/content/Posts/mediumPosts'))

  /* TODO
     1. 爬個人頁面所有 post 並轉出 markdown file
     2. 在 hugo-resource 利用 github hook & scripts 自動 build 並 deploy github page
  */

 
});

/* test 591 data */
/* let page = 1 // default 1
let locationId = 1 // taipei

const test591Url = `https://newhouse.591.com.tw/home/housing/search?rid=${locationId}&sid=&page=${page}`
const testXinYiUrl = 'https://www.sinyi.com.tw/'

const testObj = {
  url: testXinYiUrl,
  headers: {
    'cookie': 'laqrSPguEGRFmmC9GQfoDOZo0l0AAAAAAKGB99puPu9oIgVBzNeBlA%3D%3D'
  }
}
request(testXinYiUrl, (error, response, body) => {
  console.log(error)
  console.log(response)
  console.log(body)

  let result = {}
  

}) */