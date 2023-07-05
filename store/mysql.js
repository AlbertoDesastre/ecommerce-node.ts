require('dotenv').config();
const mysql = require('mysql');

const dbconf = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let connection;

function handleConnection() {
  connection = mysql.createConnection(dbconf);

  connection.connect((err) => {
    if (err) {
      console.error('[db erro]', err.message);
      setTimeout(handleConnection, 2000);
    } else {
      console.log('DB Connected :)');
    }
  });

  connection.on('error', (err) => {
    console.error('db errr', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleConnection();
    } else {
      throw err;
    }
  });

  /*  return connection;  */
}

handleConnection();

function list(table) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table}`, (err, data) => {
      if (err) return reject(err);

      /* I have to do this map because the data I receive from MYSQL are encapsuled in objects called "RawDataPocket" and I want the JSONs without names */
      data.map((objetFromQuery) => ({
        ...objetFromQuery,
      }));

      resolve(data);
    });
  });
}

function create() {}

/* handleConnection(); */

module.exports = { list, create };
