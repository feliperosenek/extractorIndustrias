const puppeteer = require('puppeteer');
const csv = require('csv-parser');
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

const sequelize = new Sequelize('eduard72_'+ params.bd +'', 'eduard72_wp625', '37@S0DSm(p', {
  host: 'sh-pro20.hostgator.com.br',
  dialect: "mysql",
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  logging: false
});


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

validaGoogle();

async function validaGoogle() {

  try {
    console.log(" ")
    console.log('        ✔  Extractor Industrias ✔');
    console.log('  ✔✔  Verificação Google e Facebook ✔✔');
    console.log(" ")

    sequelize.authenticate().then(() => {}).catch(err => {
      console.error('Erro ao conectar a banco de dados: ', err);
    });

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

    var array = [];
    var getNameIndustry = "";
    var urlSearch = "";
    var nameIndustries = [];
    var url = [];
    var link = "";
    var nameIndustriesVerify = "";
    var explodeNameIndustry = [];
    var linkItemResult = [];
    var arrayResultsNome = [];
    var arrayResults = [];
    var site = [];
    var tel1 = "";
    var tel2 = "";
    var facebookAbout;
    var emailAtualizado = 0;
    var telefoneAtualizado = 0;


    const getIndustrias = await sequelize.query("SELECT id_catalogo, nome, fantasia FROM `catalogo` WHERE atualizado=0 ORDER BY RAND()", { // pega as industrias no banco que não estão atualizadas em ordem aleatória
      type: QueryTypes.SELECT
    });

    console.log(" ")
    console.log("  ▶▶▶ " + (getIndustrias.length - 1) + " industrias carregadas") // conta o número de industrias nao atualizadas

    for (let i = 0; i < getIndustrias.length; i++) { // loop principal que roda de acordo com o número de indústrias

      if (i == 0) {
        console.log(" ");
        console.log(" ");
        console.log(" 🔎   Iniciando buscas 🔎")
      } else {

        console.log(" ");
        console.log(" ");
        console.log(" 🔎   Buscando informações sobre: " + getIndustrias[i].nome)
        console.log("Pesquisa " + i + " de " + (getIndustrias.length - 1))
      }

        // --> DEFINE A URL DE PESQUISA DE ACORDO COM O NOME DA EMPRESA

      urlSearch = getIndustrias[i].nome.replace(/\s/g, "+"); // pega o nome da empresa e formata os espaçoes com o caracteres + para ser usado na pesquisa do Google

      page.goto("https://www.google.com.br/search?q=" + urlSearch) //faz a busca com a url formatada
      await delay(4000)

      data = await page.evaluate(() => document.querySelector('*').outerHTML); // carrega o HTML de página de busca
      dom = new JSDOM(data); // feito com javascript nativo DOM para facilitar a busca
      await delay(4000)

      // ->> GUARDA OS LINKS DA PÁGINA EM UM ARRAY
      var linkItemResult = dom.window.document.querySelectorAll(".yuRUbf > a"); // busca a classe do título da pesquisa e extrai o href do link

      // --> VERIFICA SE ABRE O CARTÃO DA EMPRESANO GOOGLE MEU NEGÓCIO
      var verifyGoogle = dom.window.document.querySelector("#rhs");

      if (verifyGoogle) { // informa ao banco a verificação se está no Google
        verifyGoogle = 1
      } else {
        verifyGoogle = 0
      }

      // --> LINKS DA PÁGINA DO GOOGLE

      for (let t = 0; t < linkItemResult.length; t++) { // resultado dos links da pagina de pesquisa
        link = linkItemResult[t].toString(); // a variavel link pega os itens link do array

        // --> SE TIVER FACEBOOK NOS LINKS DA PESQUISA, BUSCAR O CONTEÚDO DA PÁGINA

        if (link.includes("facebook") && link.includes("profile") === false && link.includes("login") === false) { //verifica se o link é Facebook
          var facebookLink = link;

          let page2 = await browser.newPage();

          page2.goto(facebookLink); // abre uma nova página
          await delay(7000)
          dataPage2 = await page2.evaluate(() => document.querySelector('*').outerHTML); // carrega o HTML de página
          domPage2 = new JSDOM(dataPage2)

          var getDataFaceook = domPage2.window.document.querySelectorAll('.qzhwtbm6 > span > span'); // encontra informações de contato

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

          var getDataFacebookAbout = domPage2.window.document.querySelector('.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql'); // pega os dados Sobre no Facebook

          if (getDataFacebookAbout) {
            if (getDataFacebookAbout.textContent.includes("Ver mais")) { //se tiver "Ver mais" no texto....

              await delay(3000)
              page2.click('.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql > div > div') // ...clica para abrir
              await delay(3000)

              dataPage3 = await page2.evaluate(() => document.querySelector('*').outerHTML); // carrega o HTML de página
              domPage3 = new JSDOM(dataPage3)
              await delay(2000)

              var getDataFacebookAbout = domPage3.window.document.querySelector('.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql'); // pega os dados com o texto expandido
              facebookAbout = facebookAbout.split("Ver menos") // retira o texto
              facebookAbout = facebookAbout[0]

            } else { // se não tiver o termo "Ver mais" pega o texto completo
              var getDataFacebookAbout = domPage2.window.document.querySelector('.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql');
              facebookAbout = getDataFacebookAbout.textContent

            }
          }

          if (!facebookAbout) {
            facebookAbout = ""
          }

          page2.close();

          // --> FECHA A PÁGINA DO FACEBOOK
        }

        // --> VERIFICA LINKEDIN

        if (link.includes("linkedin") && link.includes("company") === true) { // se tiver incluso é Linkedin
          var linkedinLink = link;
        }

        // --> VERIFICA INSTAGRAM
        if (link.includes("instagram")) { // se tiver incluso é Instagram
          var instagramLink = link;
        }

        // --> VERIFICA SITE
        explodeNameIndustry = urlSearch.split("+") // divide a url de pesquisa em um array

        for (var r = 0; r < explodeNameIndustry.length; r++) { // verifica se o nome da empresa está também no linkSite
          nameIndustriesVerify = explodeNameIndustry[r].toLowerCase(); // pega cada palavra do nome e pesquisa na url
          nameIndustriesVerify = "www." + nameIndustriesVerify;

          if (link.includes(nameIndustriesVerify) === true && nameIndustriesVerify != "www.e" && nameIndustriesVerify != "www.de") { //filtro para obter o site
            var linkSite = link.split("/");
            linkSite = linkSite[0] + "//" + linkSite[1] + linkSite[2]

          }
        }

      }

      // --> DADOS NO GOOGLE

      var telefone1 = dom.window.document.querySelector(".LrzXr > a > span > span") // pega o telefone no Google

      var endereco = dom.window.document.querySelector(".LrzXr") // pega o endereço no Google

      if (telefone1 == null) {
        telefone1 = ""
      } else {
        telefone1 = telefone1.textContent
      }

      if (endereco == null) {} else {
        endereco = endereco.textContent
      }

        // cria um array com os resultados da busca no Google

      results = {
        id: getIndustrias[i].id_catalogo,
        nome: getIndustrias[i].nome,
        site: linkSite,
        face: facebookLink,
        insta: instagramLink,
        linked: linkedinLink,
        telefone: telefone1,
        telefone2: getFacebookFone,
        whatsapp: getFacebookWhatsapp,
        sobre: facebookAbout,
        email: getFacebookEmail,
        endereco: endereco
      }


      console.log(results)


      // Consulta os dados originais da empresa no banco
      var getDataBase = await sequelize.query("SELECT id_catalogo, nome, endereco, ddd_telefone, telefone, ddd_telefone2, telefone2, email, email_compras, email_vendas, pagina_web, descricao, ddd_celular, celular, facebook, instagram, linkedin FROM `catalogo` WHERE id_catalogo =  '" + results.id + "' ", {
        type: QueryTypes.SELECT
      });

      if (getDataBase[0] === undefined || results.telefone == null || results.telefone2 == null) { // se o banco estiver vazio ou telefone for nulo, não faz nada

      } else {

        if (results.telefone.includes("(")) { // verifica se o resultado é um telefone
          tel1 = results.telefone.split(" ");
          dddTelefone = tel1[0].split("(")
          dddTelefone = dddTelefone[1].split(")")
          dddTelefone = dddTelefone[0]
          // filtro para tirar caracteres
          tel1 = results.telefone.split("-")
          var telGoogle = tel1[0] + tel1[1]
          telGoogle = telGoogle.split(" ")
          telGoogle = telGoogle[1]
        }

        if(results.telefone2.includes("a")){
          results.telefone2 = ""
        }

        if (results.telefone2.includes("(")) { // verifica se o resultado é um telefone
          tel2 = results.telefone2.split(" ");
          dddTelefone2 = tel2[0].split("(")
          dddTelefone2 = dddTelefone2[1].split(")")
          dddTelefone2 = dddTelefone2[0]
          // filtro para tirar caracteres
          tel2 = results.telefone2.split("-")
          var telFacebook = tel2[0] + tel2[1]
          telFacebook = telFacebook.split(" ")
          telFacebook = telFacebook[1]
        }

        if (telGoogle == telFacebook) { // se os telefones forem iguais, deixa só um
          telFacebook = "";
          dddTelefone2 = "";
        }

        //verifica se os telefones foram atualizados
        if(telGoogle != getDataBase[0].telefone && getDataBase[0].telefone !="" && telGoogle !=""){
          telefoneAtualizado = 1
        }

        if(telFacebook != getDataBase[0].telefone2 && getDataBase[0].telefone2 !="" && telFacebook !=""){
          telefoneAtualizado = 1
        }


        if (!dddTelefone) { // se o telefone for vazio, pega o original
          dddTelefone = getDataBase[0].ddd_telefone
        }
        if (!telGoogle) { // se o telefone for vazio, pega o original
          telGoogle = getDataBase[0].telefone
        }

        if (!dddTelefone2) { // se o telefone for vazio, pega o original
          dddTelefone2 = getDataBase[0].ddd_telefone2
        }
        if (!telFacebook) { // se o telefone for vazio, pega o original
          telFacebook = getDataBase[0].telefone2
        }


        if (getDataBase[0].email == getFacebookEmail) { //se os email foram iguai, deixa um só
          getFacebookEmail = "";
        }

        if (!getFacebookEmail) { // se o email do Facebook for vazio, pega o original
          facebookLink = ""
          getFacebookEmail = getDataBase[0].email
        }

        verifyEmail = getDataBase[0].email // verificação se o email foi atualizado
        verifyEmail = verifyEmail.toLowerCase()
        getFacebookEmail = getFacebookEmail.toLowerCase()

        if (getFacebookEmail != verifyEmail) {
          emailAtualizado = 1
        }

        if (!results.site) { // se o site for vazio, pega o original
          results.site = getDataBase[0].pagina_web
        }
        if (!endereco || endereco == null) { // se o enredeço for vazio, pega o original
          endereco = getDataBase[0].endereco
        }
        if (!facebookAbout) { // se o descricao for vazio, pega o original
          facebookAbout = getDataBase[0].descricao
        }

        await sequelize.query("UPDATE catalogo SET ddd_telefone='" + dddTelefone + "', telefone='" + telGoogle + "', ddd_telefone2='" + dddTelefone2 + "', telefone2='" + telFacebook + "', email='" + getFacebookEmail + "', pagina_web='" + results.site + "', instagram='" + instagramLink + "', facebook='" + facebookLink + "', linkedin='" + linkedinLink + "', descricao='" + facebookAbout + "', emailAtualizado='" + emailAtualizado + "', telefoneAtualizado='" + telefoneAtualizado + "', atualizado=1, google=" + verifyGoogle + "  WHERE id_catalogo = " + getDataBase[0].id_catalogo + "")
        console.log('  ✔  Atualizado ');

      }

      // reseta as variáveis

      facebookLink = "";
      instagramLink = "";
      linkedinLink = "";
      linkSite = "";
      telefone = "";
      endereco = "";
      getFacebookFone = "";
      getFacebookWhatsapp = "";
      facebookAbout = "";
      getFacebookEmail = "";
      sobre = "";
      dddTelefone = "";
      dddTelefone2 = "";
      telGoogle = "";
      telFacebook = "";
      results = [];
      emailAtualizado = 0;

    }
    console.log("Finalizado!!")
    browser.close();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
