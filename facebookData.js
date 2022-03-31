const puppeteer = require('puppeteer');
const fs = require('fs');
const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;
const Sequelize = require('sequelize');
const {
  QueryTypes
} = require('sequelize');
const minimist = require('minimist');
const params = minimist(process.argv.slice(2))

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const sequelize = new Sequelize("eduard72_emailmkt", "eduard72_wp625", "37@S0DSm(p", {
  host: 'sh-pro20.hostgator.com.br',
  dialect: "mysql",
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  logging: false
});

facebookData();

async function facebookData() {

  try {

    let options = {
      defaultViewport: {
        width: 1366,
        height: 768,
      },
      args: ['--no-sandbox'],
      headless: true,
    };

    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();

    var getFacebook = await sequelize.query("SELECT id, url FROM facebook WHERE atualizado=0 ORDER BY rand()", {
      type: QueryTypes.SELECT
    })

    for (x = 0; x < getFacebook.length; x++) {

    page.goto(getFacebook[x].url); // abre uma nova página

    await delay(7000)
    dataPage = await page.evaluate(() => document.querySelector('*').outerHTML); // carrega o HTML de página
    domPage = new JSDOM(dataPage)

    var getDataFaceook = domPage.window.document.querySelectorAll('.qzhwtbm6 > span > span'); // encontra informações de contato

    for (n = 0; n < 10; n++) { //percorre os itens da página

      var facebookRow = getDataFaceook[n]; // cria uma variável que recebe o valor de cada linha
      var contentRow = ""

      if (facebookRow) { // pega o texto da Linha
        contentRow = facebookRow.textContent
      }

      if (contentRow.includes("@", ".com", ".br")) { // se tiver incluso é email
        var getFacebookEmail = contentRow
      }

      if (contentRow.includes("(", ")", "-") && contentRow.includes("1", "2", "3", "4", "5", "6", "7", "8", "9", "0")) { // se tiver incluso é telefone
        var getFacebookFone = contentRow
      }

      if (contentRow.includes("+", "55")) { //se tiver incluso é Whatsapp
        var getFacebookWhatsapp = contentRow
      }

      if (contentRow.includes("http", "//")) { // se tiver incluso é site
        var getFacebookSite = contentRow
      }
    }
      results = {
      email:getFacebookEmail,
      telefone:getFacebookFone,
      whatsapp:getFacebookWhatsapp,
      site:getFacebookSite
    }

    await sequelize.query("UPDATE facebook SET email='" + results.email + "', telefone='" + results.telefone + "', whatsapp='" + results.whatsapp + "', site='" + results.site + "', atualizado=1 WHERE id="+getFacebook[x].id+"")
    console.log(results);

    getFacebookEmail=""
    getFacebookFone=""
    getFacebookWhatsapp=""
    getFacebookSite=""
  }






  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
