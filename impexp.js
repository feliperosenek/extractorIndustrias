  const consultarCNPJ = require('consultar-cnpj')
  const token = 'krFHdXd6msHAoAv2YKYgNddzJSunRMPXjYbePiRxNvfz'
  const puppeteer = require('puppeteer');
  const Sequelize = require('sequelize');
  const {
    QueryTypes
  } = require('sequelize')
  const jsdom = require("jsdom");
  const {
    JSDOM
  } = jsdom;
  const minimist = require('minimist');
  const params = minimist(process.argv.slice(2))

  const sequelize = new Sequelize("eduard72_" + params.bd + "", "eduard72_wp625", "37@S0DSm(p", {
    host: 'sh-pro20.hostgator.com.br',
    dialect: "mysql",
    define: {
      freezeTableName: true,
      timestamps: false,
    },
    logging: false
  });

  console.log(" - " + params.acao + " - ");

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  var page = 0;
  var pages = 1;
  var s = 0;
  var ordemBusca = "";


  sequelize.authenticate().then(() => {})
    .catch(err => {
      console.error('Erro ao conectar a banco de dados: ', err);
    });

  async function getCNPJ() {
    try {


      var getIndustrias = await sequelize.query("SELECT cnpj, importa, exporta FROM `impexp` WHERE atualizado=0 ORDER BY rand()", {
        type: QueryTypes.SELECT
      });

      console.log(getIndustrias.length);

          // --> Processamento da pesquisa no array industria
          for (x = 0; x < getIndustrias.length; x++) {

            const industria = await consultarCNPJ(getIndustrias[x].cnpj, token) // --> Consulta o CNPJ

            nome = industria.razao_social;
            cnpj = industria.estabelecimento.cnpj;
            fantasia = industria.estabelecimento.nome_fantasia;
            endereco = industria.estabelecimento.tipo_logradouro + " " + industria.estabelecimento.logradouro;
            numero = industria.estabelecimento.numero;
            tipo_logradouro = industria.estabelecimento.tipo_logradouro;
            complemento = industria.estabelecimento.complemento;
            bairro = industria.estabelecimento.bairro;
            cep = industria.estabelecimento.cep;
            municipio = industria.estabelecimento.cidade.nome;
            uf = industria.estabelecimento.estado.sigla;
            pais = industria.estabelecimento.pais.nome;
            ddd_telefone = industria.estabelecimento.ddd1;
            telefone = industria.estabelecimento.telefone1;
            email = industria.estabelecimento.email;
            ddd_telefone2 = industria.estabelecimento.ddd2;
            telefone2 = industria.estabelecimento.telefone2;
            cnae = industria.estabelecimento.atividade_principal.id;
            cadastro = industria.estabelecimento.situacao_cadastral;
            porte = industria.porte.descricao;
            produto_2 = industria.estabelecimento.atividade_principal.descricao;
            produto_3 = industria.estabelecimento.atividades_secundarias;
            tipo = industria.estabelecimento.tipo;
            capital = industria.capital_social
            produto_1 = "Industria";
            inscricao = "Regular";
            filial = 0;
            matriz = 0;
            fundacao = industria.estabelecimento.data_inicio_atividade

            // filtros
            if (fundacao != null) {
              fundacao = fundacao.split("-")
              fundacao = fundacao[0]
            }

            var atividade = []
            if (produto_3 !== null) {
              for (n = 0; n < produto_3.length; n++) {
                atividade.push(produto_3[n].descricao) + " "
              }
            }

            produto_3 = atividade.join();

            if (tipo != null) {
              if (tipo.includes("Matriz")) {
                matriz = 1;
              }

              if (tipo.includes("Filial")) {
                filial = 1;
              }
            }

            if (cadastro == "Ativa") {
              var simbol = "✔"
            }

            if (cadastro == "Baixada") {
              var simbol = "X"
            }

            if (nome == null) {
              nome = ""
            }
            if (cnpj == null) {
              cnpj = ""
            }
            if (fantasia == null) {
              fantasia = ""
            }
            if (endereco == null) {
              endereco = ""
            }
            if (tipo_logradouro == null) {
              tipo_logradouro = ""
            }
            if (numero == null) {
              numero = ""
            }
            if (complemento == null) {
              complemento = ""
            }
            if (bairro == null) {
              bairro = ""
            }
            if (cep == null) {
              cep = ""
            }
            if (municipio == null) {
              municipio = ""
            }
            if (uf == null) {
              uf = ""
            }
            if (pais == null) {
              pais = ""
            }
            if (ddd_telefone == null) {
              ddd_telefone = ""
            }
            if (telefone == null) {
              telefone = ""
            }
            if (email == null) {
              email = ""
            }
            if (ddd_telefone2 == null) {
              ddd_telefone2 = ""
            }
            if (telefone2 == null) {
              telefone2 = ""
            }
            if (capital == null) {
              capital = ""
            }
            if (cnae == null) {
              cnae = ""
            }
            if (produto_1 == null) {
              produto_1 = ""
            }
            if (produto_2 == null) {
              produto_2 = ""
            }
            if (produto_3 == null) {
              produto_3 = ""
            }
            if (matriz == null) {
              matriz = ""
            }
            if (filial == null) {filial = ""
            }

            var res = 0;

            importa = getIndustrias[x].importa;
            exporta = getIndustrias[x].exporta;

            // --> Verifica se o CNPJ já está cadastrado no banco de dadso
            const verificaDuplicata = await sequelize.query("SELECT cnpj FROM `catalogo` WHERE cnpj=" + getIndustrias[x].cnpj + "", {
              type: QueryTypes.SELECT
            });        

            if(verificaDuplicata == ""){
              if(nome.includes("'") || endereco.includes("'") || bairro.includes("'") || municipio.includes("'") || telefone == "" || fantasia.includes("'") || tipo_logradouro.includes("'") || cadastro.includes("Baixada")){

              }else{
                await sequelize.query("INSERT INTO catalogo (nome,cnpj, fantasia, endereco, tipo_logradouro, numero,complemento, bairro, cep, municipio, uf,pais,ddd_telefone, telefone, email, ddd_telefone2, telefone2, capital, cnae, produto_1, produto_2, produto_3, matriz, filial,ano_fundacao,produtos,materias_primas,nro_funcionarios,exporta,importa) VALUES ('" + nome + "','" + cnpj + "','" + fantasia + "','" + endereco + "','" + tipo_logradouro + "','" + numero + "','" + complemento + "','" + bairro + "','" + cep + "','" + municipio + "','" + uf + "','" + pais + "','" + ddd_telefone + "','" + telefone + "','" + email + "','" + ddd_telefone2 + "','" + telefone2 + "','" + capital + "','" + cnae + "','" + produto_1 + "','" + produto_2 + "','" + produto_3 + "','" + matriz + "','" + filial + "','" + fundacao + "',0,0,0,'" + exporta + "','" + importa + "') ")
               res = 1;
              }
            }else{
              console.log("No banco!")
              await sequelize.query("UPDATE catalogo SET importa='" + importa + "' WHERE cnpj=" + getIndustrias[x].cnpj + "",{
                type: QueryTypes.UPDATE
              });

              await sequelize.query("UPDATE catalogo SET exporta='" + exporta + "' WHERE cnpj=" + getIndustrias[x].cnpj + "",{
                type: QueryTypes.UPDATE
              });

            }

            if (res == 0) {
              res = ""
            } else {
              res = "    ✔ bd "
            }

            console.log("  " + simbol + "  " + nome + res);

            await sequelize.query("UPDATE catalogo SET atualizado=5 WHERE cnpj=" + getIndustrias[x].cnpj + "",{
              type: QueryTypes.UPDATE
            });


            await sequelize.query("UPDATE impexp SET atualizado=5 WHERE cnpj=" + getIndustrias[x].cnpj + "",{
              type: QueryTypes.UPDATE
            });
          }





    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  getCNPJ()
