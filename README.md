                        
 cnpjApi: Faz a requisição de dados das indústrias na API CNPJ.WS
          Modo de uso:
                node cnpjApi.js 
                --uf -> ID do estado 
                --bd -> nome do banco de dados
                --bot -> ID do bot
                --acao 'Descrição da ação' 
               
               node cnpjApi.js --uf 31 --bd minasgerais --bot 1 --paginas 20 --acao 'Get Industrias - Minas Gerais'                 
                
                
extractorIndustrias: Validador das industrias obtidas pela cnpjApi.
                     Tipo de validações:
                        Google: Verificação se a industrias está cadastrada no Google, 
                        como forma de qualificar a validação de uma industria ativa 
                        e com informações válidas de contato.
                        
                        Facebook: Valida o email de contato e telefone se a industria está no Facebook.
                        
                     Modo de uso:
                        node extractorIndustrias.js --bd nome do banco de dados
                        
