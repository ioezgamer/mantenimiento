const faunadb = require('faunadb');
require('dotenv').config();

// Inicializar el cliente de FaunaDB
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET
});

module.exports = { q, client };