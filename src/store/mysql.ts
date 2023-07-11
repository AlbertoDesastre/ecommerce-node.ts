require("dotenv").config();
const mysql = require("mysql");

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
      console.error("[db erro]", err.message);
      setTimeout(handleConnection, 2000);
    } else {
      console.log("DB Connected :)");
    }
  });

  connection.on("error", (err) => {
    console.error("db errr", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleConnection();
    } else {
      throw err;
    }
  });

  /*  return connection;  */
}

handleConnection();

function getOne({ table, id }) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE id = ${id}`, (err, data) => {
      if (err) return reject(err);

      /* I have to do this map because the data I receive from MYSQL are encapsuled in objects called "RawDataPocket" and I want the JSONs without names */
      data.map((objetFromQuery) => ({
        ...objetFromQuery,
      }));

      resolve(data);
    });
  });
}

function list({ table, limit, offset }) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`,
      (err, data) => {
        if (err) return reject(err);

        /* I have to do this map because the data I receive from MYSQL are encapsuled in objects called "RawDataPocket" and I want the JSONs without names */
        data.map((objetFromQuery) => ({
          ...objetFromQuery,
        }));

        resolve(data);
      }
    );
  });
}

/* table = string , conditions = string , filters = array with searched values
For example:
table = 'products';
conditions = 'name LIKE ?  AND price <= ?  AND color LIKE ?';
filters = [ '%ca%', 800, '%black%' ];
*/
function filterBy({ table, conditions, filters }) {
  const query = `SELECT * FROM ${table} WHERE ` + conditions;

  return new Promise((resolve, reject) => {
    connection.query(query, [...filters], (err, data) => {
      if (err) return reject(err);

      data.map((objetFromQuery) => ({
        ...objetFromQuery,
      }));

      resolve(data);
    });
  });
}

/* Important, the "arrayOfData" must be an array with the VALUES of the JSON coming from the request, for example: [[value1,value2], [value1,value2]] */
function create(table, arrayOfData) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO ${table} (category_id, name, description, price, quantity, image) VALUES ?`,
      [arrayOfData],
      (err, data) => {
        if (err) return reject(err);

        resolve(data);
      }
    );
  });

  /* This can create some confusion, but in reality mysql library need an array, with an array, with N amounts of arrays which contains
    the information of the Jsons. This mean that the actual data provided to connection.query it's something like...

[  <---- look at the extra array "container"
 [
  [
    1,
    'iPhone 13 Pro',
    'The latest flagship smartphone from Apple.',
    10,
    50,
    'https://example.com/iphone13pro.jpg'
  ],
  [
    1,
    'iPhone 13 Pro',
    'The latest flagship smartphone from Apple.',
    10,
    50,
    'https://example.com/iphone13pro.jpg'
  ],
  [
    1,
    'iPhone 13 Pro',
    'The latest flagship smartphone from Apple.',
    10,
    50,
    'https://example.com/iphone13pro.jpg'
  ]
 ]
]  <---- look at the extra array "container"
In summary, it is required to always send a array as a container when sending multiple rows to insert
*/
}

function update({ table, item, id }) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET ? WHERE id = ?`,
      [item, id],
      (err, data) => {
        if (err) return reject(err);

        resolve(data);
      }
    );
  });
}

function toggleItemStatus({ table, boolean, id }) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET active = ${boolean} WHERE id = ${id}`,
      (err, data) => {
        if (err) return reject(err);

        resolve(data);
      }
    );
  });
}

function eliminate({ table, id }) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM ${table} WHERE id = ${id}`, (err, data) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
}

/* handleConnection(); */

export { getOne, list, filterBy, create, update, toggleItemStatus, eliminate };
