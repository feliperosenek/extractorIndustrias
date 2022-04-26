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

facebookLink();

async function facebookLink() {

  try {

    let options = {
      defaultViewport: {
        width: 1366,
        height: 768,
      },
      headless: false,
    };

    var getLinks = await sequelize.query("SELECT id, link FROM links WHERE atualizado=0", {
      type: QueryTypes.SELECT
    })

    console.log(getLinks.length + " Links");

    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();

    page.goto("https://www.facebook.com");

    await delay(7000)
    var usernameInput = await page.$("input[name='email']");
    var passwordInput = await page.$("input[name='pass']");

    await page.keyboard.type("feliperosenek@gmail.com", {
      delay: 100
    });

    await passwordInput.click();
    await page.keyboard.type("feliperosene2130", {
      delay: 100
    });

    var loginButton = await page.$("button[name='login']");
    await loginButton.click()

    await delay(10000)

    for (var x = 0; x < getLinks.length; x++) {

      page.goto(getLinks[x].link)

      await delay(10000)

      for (var i = 0; i < 1000; i++) {
        await page.evaluate(async () => {
          window.scrollBy(0, 600);
        });
        data = await page.evaluate(() => document.querySelector('*').outerHTML);
        dom = new JSDOM(data); // feito com javascript nativo DOM para facilitar a busca
        endResults = dom.window.document.querySelector(".l9j0dhe7.du4w35lb.rq0escxv.j83agx80.cbu4d94t.pfnyh3mw.d2edcug0.pybr56ya");
        console.log(i + " de: " + 1000);
        if(endResults){
          break
        }
      }

      data = await page.evaluate(() => document.querySelector('*').outerHTML);
      dom = new JSDOM(data); // feito com javascript nativo DOM para facilitar a busca
      await delay(4000)

      var urlFacebook = dom.window.document.querySelectorAll('.nc684nl6 > a')

      console.log("Salvando "+ urlFacebook.length + " Páginas");

      for (var y = 0; y < urlFacebook.length; y++) {
        await sequelize.query("INSERT INTO facebook (url) VALUES ('" + urlFacebook[y].href + "')")

      }
      await sequelize.query("UPDATE links SET atualizado=1 WHERE id="+getLinks[x].id+"")
      console.log("Aguardando 5 minutos para um novo Loop")
      await delay(300000)

    }


  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
