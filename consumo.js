const consultarCNPJ = require('consultar-cnpj')

async function consumo(){
  const token = 'krFHdXd6msHAoAv2YKYgNddzJSunRMPXjYbePiRxNvfz'

  const consumo = await consultarCNPJ.consumo(token)
  console.log(consumo)
}

consumo()
