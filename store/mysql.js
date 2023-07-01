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

  return connection;
}

/* handleConnection(); */

module.exports = handleConnection;
