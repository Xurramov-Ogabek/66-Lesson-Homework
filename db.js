const { Client } = require('pg');

const client = new Client({
    user: 'postgres', 
    host: 'localhost', 
    database: 'library',
    password: 'trust', 
    port: 5432 
});

client.connect()
    .then(() => console.log('PostgreSQL Connected'))
    .catch(err => console.error('PostgreSQL connection failed:', err));

module.exports = client;