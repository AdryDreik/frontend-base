var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER: '"http://192.168.28.109:3000"',
  API_URL: '"http://192.168.28.109:3000/api/v1/"',
  GRAPHQL_URL: '"http://192.168.28.109:3000/graphql/"',
  AUTH_URL: '"http://192.168.28.109:3000/api/auth/signin"',
  INSTANCIADOR_URL: '"https://test.agetic.gob.bo/bpm-instanciador"',
  ONBEFOREUNLOAD: false,
  DEBUG_MODE: true
})