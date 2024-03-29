const consultarCNPJ = require('consultar-cnpj')
const token = '3tYHPzUXxm9gEMtLsQa2n51fbKVNHDOqBkpL7GsfOyaG'
const Sequelize = require("sequelize")
const {
  QueryTypes
} = require('sequelize')
const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;
const minimist = require('minimist');
const { addConsoleHandler } = require('selenium-webdriver/lib/logging');
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

    // --> Pega os CNAEs no banco
   if (params.bot == 1) {
    ordemBusca = '&& id > 1 && id <= 32';
}
if (params.bot == 2) {
    ordemBusca = '&& id > 33 && id <= 64';
}
if (params.bot == 3) {
    ordemBusca = '&& id > 65 && id <= 96';
}
if (params.bot == 4) {
    ordemBusca = '&& id > 97 && id <= 128';
}
if (params.bot == 5) {
    ordemBusca = '&& id > 129 && id <= 160';
}
if (params.bot == 6) {
    ordemBusca = '&& id > 161 && id <= 192';
}
if (params.bot == 7) {
    ordemBusca = '&& id > 193 && id <= 224';
}
if (params.bot == 8) {
    ordemBusca = '&& id > 225 && id <= 256';
}
if (params.bot == 9) {
    ordemBusca = '&& id > 257 && id <= 288';
}
if (params.bot == 10) {
    ordemBusca = '&& id > 289 && id <= 320';
}
if (params.bot == 11) {
    ordemBusca = '&& id > 321 && id <= 352';
}
if (params.bot == 12) {
    ordemBusca = '&& id > 353 && id <= 384';
}
if (params.bot == 13) {
    ordemBusca = '&& id > 385 && id <= 416';
}
if (params.bot == 14) {
    ordemBusca = '&& id > 417 && id <= 448';
}
if (params.bot == 15) {
    ordemBusca = '&& id > 449 && id <= 480';
}
if (params.bot == 16) {
    ordemBusca = '&& id > 481 && id <= 512';
}
if (params.bot == 17) {
    ordemBusca = '&& id > 513 && id <= 544';
}
if (params.bot == 18) {
    ordemBusca = '&& id > 545 && id <= 576';
}
if (params.bot == 19) {
    ordemBusca = '&& id > 577 && id <= 608';
}
if (params.bot == 20) {
    ordemBusca = '&& id > 609 && id <= 642';
}


    var cnaes = await sequelize.query("SELECT cnae FROM `cnaes` WHERE statusBot" + params.bot + "=0 "+ ordemBusca +" ORDER BY RAND()", {
      type: QueryTypes.SELECT
    });

    // --> Abre um loop para pesquisar os cnaes
    for (i = 0; i < cnaes.length; i++) {
      cnaesSearch = cnaes[i].cnae;
      // pesquisa por cnae
      const data = await consultarCNPJ.pesquisa({
          atividade_principal_id: cnaesSearch,
          estado_id: params.uf
        },
        token,
        1
      );

      console.log(" CNAE: " + cnaesSearch + "- total: "+ data.paginacao.total + "  |" + (i + 1) + "º de " + cnaes.length + " | Páginas: " + data.paginacao.paginas)
      console.log(" - - " + params.acao + " - - ");

      var pageRound = params.paginas

      if( data.paginacao.paginas < pageRound){
        pageRound =  data.paginacao.paginas
      }

      for (var t = 0; t < pageRound; t++) {
        // --> Define uma página aleatória
        if(pageRound > params.paginas){
          page = Math.floor(Math.random() * pageRound) + 1;
        }else{page = t+1}
        
        console.log("Página: " + page +"  | "+ (i + 1) + "º de " + cnaes.length);

        // --> Pesquisa por página
        const data2 = await consultarCNPJ.pesquisa({ // --> Consulta o CNAE
            atividade_principal_id: cnaesSearch,
            estado_id: params.uf
          },
          token,
          page
        );

        // --> Processamento da pesquisa no array industria
        for (x = 0; x < data2.data.length; x++) {

          const industria = await consultarCNPJ(data2.data[x], token) // --> Consulta o CNPJ

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
          if(industria.porte){
          porte = industria.porte.descricao;
          }else{
          porte = ''
          }
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

          // --> Verifica se o CNPJ já está cadastrado no banco de dadso
          const verificaDuplicata = await sequelize.query("SELECT cnpj FROM `catalogo` WHERE cnpj='" + cnpj + "'", {
            type: QueryTypes.SELECT
          });

          // --> Filtros para inserir no banco de dados
          if (verificaDuplicata != "" || nome.includes("'") || endereco.includes("'") || bairro.includes("'") || municipio.includes("'") || telefone == "" ||  email == "" || fantasia.includes("'") || tipo_logradouro.includes("'") || cadastro.includes("Baixada") || cadastro.includes("Inapta")) {

          } else {
            await sequelize.query("INSERT INTO catalogo (nome,cnpj, fantasia, endereco, tipo_logradouro, numero,complemento, bairro, cep, municipio, uf,pais,ddd_telefone, telefone, email, ddd_telefone2, telefone2, capital, cnae, produto_1, produto_2, produto_3, matriz, filial,ano_fundacao,produtos,materias_primas,nro_funcionarios,importa,exporta) VALUES ('" + nome + "','" + cnpj + "','" + fantasia + "','" + endereco + "','" + tipo_logradouro + "','" + numero + "','" + complemento + "','" + bairro + "','" + cep + "','" + municipio + "','" + uf + "','" + pais + "','" + ddd_telefone + "','" + telefone + "','" + email + "','" + ddd_telefone2 + "','" + telefone2 + "','" + capital + "','" + cnae + "','" + produto_1 + "','" + produto_2 + "','" + produto_3 + "','" + matriz + "','" + filial + "','" + fundacao + "',0,0,0,0,0 ) ")
            res = 1;
          }
          if (res == 0) {
            res = ""
          } else {
            res = "    ✔ bd "
          }

          console.log("  " + simbol + "  " + nome + res);
        }

        pages = await data.paginacao.paginas
      }
      // --> Informa que o cnae já foi usado
      await sequelize.query("UPDATE cnaes SET statusBot" + params.bot + "=1 WHERE cnae=" + cnaesSearch + "")
      await sequelize.query("UPDATE cnaes SET total="+ data.paginacao.total +" WHERE cnae=" + cnaesSearch + "")
    }

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

getCNPJ()
