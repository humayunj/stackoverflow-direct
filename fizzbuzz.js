const { JSDOM } = require("jsdom");

var prompt = require("prompt");

const axios = require("axios").default;

const url = `https://stackoverflow.com/questions/5016313/how-to-determine-if-a-number-is-odd-in-javascript`;
const QRY_POST = " snippet site:stackoverflow.com";

(async () => {
  console.log("\x1b[0m", "");

  prompt.start();

  let qry = await new Promise((resolve) => {
    prompt.get(["query"], function (err, result) {
      resolve(result.query || err);
    });
  });
  qry = qry + QRY_POST;

  console.log("Finding from stackoverflow\n...\n");
  let googleResult = (
    await axios.get(
      `https://www.google.com/search?q=${encodeURIComponent(qry)}`
    )
  ).data;

  // console.log(googleResult)

  let { document: gdoc } = new JSDOM(googleResult).window;

  let url = gdoc.querySelector(".kCrYT a").getAttribute("href");

  let resp = (await axios.get(`https://www.google.com/${url}`));

  let { document } = new JSDOM(resp.data).window;

  let snippet = document.querySelector(".answercell .snippet code");

  if (snippet == null) {
    console.log("Couldn't find standalone answer");
  } else {
    console.log(
      "\x1b[32m",
      `\n\CODE\nhttps://stackoverflow.com${resp.request.path}\n=============\n\n`,
      snippet.textContent,
      "\n\n=============\n"
    );
    console.log("\x1b[0m", "");

    let run = await new Promise((resolve) => {
      prompt.get(["run"], function (err, result) {
        resolve(result.run || err);
      });
    });
    if (run == "y" || run == "yes") eval(snippet.textContent);
  }
})();
