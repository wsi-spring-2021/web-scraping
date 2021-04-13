/** Require the NodeJS file utils library.
  @constant
  @type {object}
*/
const fs = require ('fs');

/** Require the Cheerio third-party library.
  {@link https://cheerio.js.org/}
  @constant
  @type {object}
*/
const cheerio = require('cheerio');

var raw_html = fs.readFileSync('data/raw/itmd.html');
var $ = cheerio.load(raw_html);

var courses = [];

console.log("There are", $('.coursetitle').length,"ITMD courses.");

$('.courseblock').each(function() {
  var course = {};
  //course['code'] = $(this).find('.coursecode').text();
  course['code'] = extractText($(this),'.coursecode');
  course['title'] = extractText($(this),'.courseblockdesc');
  //course['title'] = $(this).find('.coursetitle').text();
  course['title'] = $(this).find('.courseblockdesc')
  .text()
  .replace(/\n/gm, "")
  .replace(/\s\s/gm, "");
  // JSON.parse(`{${uggo.toLowerCase().replace(/(\d)(?!$)/gm, "$1,").replace(/([a-z]+)/gm, '"$1"')}}`);
  courses.push(course);
  hours = $(this).find('.hours')
  .text()
  .toLowerCase()
  .replace(/\n/gm, '')
  .replace(/(\d)(?!$)/gm, "$1,")
  .replace(/([a-z]+)/gm, '"$1"');
  course['hours'] = JSON.parse(`{${hours}}`);
  if (course['hours'].hasOwnProperty('credit')) {
    course['hours']['credits'] = course['hours']['credit'];
    course['hours']['lecture'] = 0;
    course['hours']['lab'] = 0;
    delete course['hours']['credit'];
  };
  // console.log($(this).text());
});

console.log(courses);
// $('.courseblockdesc').text().replace(/\n/gm, "");

// fs.writeFileSync('data/itmd.json',JSON.stringify(courses));

/**
  Extract simple text from small elements.
  @function
  @param {object} element A cheerio parent eleme
  @param {string} selector A CSS selector for the child element
  @returns {string} The child's text content
*/

function extractText(element,selector) {
  return element.find(selector).text();
}
