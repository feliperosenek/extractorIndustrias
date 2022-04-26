const Sequelize = require('sequelize');
const {
  QueryTypes
} = require('sequelize');

const sequelize = new Sequelize("eduard72_emailmkt", "eduard72_wp625", "37@S0DSm(p", {
  host: 'sh-pro20.hostgator.com.br',
  dialect: "mysql",
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  logging: false
});



makeLinks();

async function makeLinks() {

  try {

    var getLink = [
    {url:'https://www.facebook.com/search/pages?q=ERP',categoria:'ERP'},
    {url:'https://www.facebook.com/search/pages?q=V%C3%81LVULAS%20E%20CONEX%C3%95ES',categoria:'Váulvula e Conexões'},
    {url:'https://www.facebook.com/search/pages?q=a%C3%A7o',categoria:'Aço'},
    {url:'https://www.facebook.com/search/pages?q=TRANSPORTES',categoria:'Transportes'},
    {url:'https://www.facebook.com/search/pages?q=borrachas',categoria:'Borracha'},
    {url:'https://www.facebook.com/search/pages?q=contabilidade',categoria:'Contabilidade'},
    {url:'https://www.facebook.com/search/pages?q=seguran%C3%A7a%20e%20monitoramento',categoria:'Segurança e Monitoramento'},
    {url:'https://www.facebook.com/search/pages?q=CONSULTORIA%20AMBIENTAL',categoria:'Consultoria Ambiental'},
    {url:'https://www.facebook.com/search/pages?q=DESCART%C3%81VEI',categoria:'Descartáveis'},
    {url:'https://www.facebook.com/search/pages?q=PL%C3%81STICOS%20INDUSTRIAIS',categoria:'PLásticos Industriais'},
    {url:'https://www.facebook.com/search/pages?q=m%C3%B3veis%20corporativos',categoria:'Moveis Corpotativos'},
    {url:'https://www.facebook.com/search/pages?q=TINTAS%20INDUSTRIAIS',categoria:'Tintas Industriais'},
    {url:'https://www.facebook.com/search/pages?q=ENERGIA%20SOLAR',categoria:'Energia Solar'},
    ]
    var i=0;
    var x=0;
    var getCidades = await sequelize.query("SELECT cidade, codigo FROM cidades", {
        type: QueryTypes.SELECT
      })
      
    while(i < getLink.length){
        while(x < getCidades.length){
            console.log(getLink[i].url + getCidades[x].codigo + "--" + getLink[i].categoria)
            await sequelize.query("INSERT INTO links (link, cidade, categoria) VALUES ('" + getLink[i].url+getCidades[x].codigo + "','" + getCidades[x].cidade + "','" + getLink[i].categoria + "')")
        x++
        }
    i++
    x=0
    }
    
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
