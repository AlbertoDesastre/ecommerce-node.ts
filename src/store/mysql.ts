require("dotenv").config();
import mysql, { MysqlError, Query } from "mysql";
import {
  CreateParams,
  DeleteParams,
  FilterByParams,
  GetOneParams,
  ListParams,
  MysqlQueryResult,
  ToggleItemStatus,
  UpdateParams,
} from "./interfaces";

const dbconf = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let connection: mysql.Connection;

function handleConnection() {
  connection = mysql.createConnection(dbconf);
  /* You will find the following important properties/methods on "err":
      err.code: The error code associated with the MySQL error.
      err.errno: The error number associated with the MySQL error.
      err.sqlMessage: The error message returned by MySQL.
      err.sqlState: The SQL state code associated with the MySQL error. */
  connection.connect((err: mysql.MysqlError) => {
    if (err) {
      console.error("[db error]", err.message);
      setTimeout(handleConnection, 2000);
    } else {
      console.log("DB Connected :)");
    }
  });

  connection.on("error", (err) => {
    console.error("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleConnection();
    } else {
      throw err;
    }
  });

  /*  return connection;  */
}

handleConnection();

function getOne({ table, id }: GetOneParams): Promise<Object[] | MysqlError> {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE id = ${id}`, (err, data) => {
      if (err) return reject(err);

      /* I have to do this map because the data I receive from MYSQL are encapsuled in objects called "RawDataPocket" and I want the JSONs without names */
      data.map((objetFromQuery: Object) => ({
        ...objetFromQuery,
      }));

      resolve(data);
    });
  });
}

function list({
  table,
  limit,
  offset,
}: ListParams): Promise<Object[] | MysqlError> {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`,
      (err, data) => {
        if (err) return reject(err);

        /* I have to do this map because the data I receive from MYSQL are encapsuled in objects called "RawDataPocket" and I want the JSONs without names */
        const products = data.map((objetFromQuery: Object) => ({
          ...objetFromQuery,
        }));

        resolve(products);
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
function filterBy({
  table,
  conditions,
  filters,
}: FilterByParams): Promise<Object[] | MysqlError> {
  const query = `SELECT * FROM ${table} WHERE ` + conditions;

  return new Promise((resolve, reject) => {
    connection.query(query, [...filters], (err, data) => {
      if (err) return reject(err);

      data.map((objetFromQuery: Object) => ({
        ...objetFromQuery,
      }));

      resolve(data);
    });
  });
}

function create({
  table,
  arrayOfData,
}: CreateParams): Promise<MysqlQueryResult | MysqlError> {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO ${table} (category_id, name, description, price, quantity, image) VALUES ?`,
      [arrayOfData],
      (err, data: MysqlQueryResult) => {
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

function update({
  table,
  item,
  id,
}: UpdateParams): Promise<MysqlQueryResult | MysqlError> {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET ? WHERE id = ?`,
      [item, id],
      (err, data: MysqlQueryResult) => {
        if (err) return reject(err);

        resolve(data);
      }
    );
  });
}

function toggleItemStatus({
  table,
  boolean,
  id,
}: ToggleItemStatus): Promise<MysqlQueryResult | MysqlError> {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET active = ${boolean} WHERE id = ${id}`,
      (err: MysqlError, data: MysqlQueryResult) => {
        if (err) return reject(err);

        resolve(data);
      }
    );
  });
}

// PENDING to check if returns a string or object
function eliminate({
  table,
  id,
}: DeleteParams): Promise<String[] | MysqlError> {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM ${table} WHERE id = ${id}`, (err, data) => {
      if (err) return reject(err);

      console.log(
        "You have pending to check if 'data' it's a string or a MysqlQueryResult !! Check it out look at this -->",
        data
      );

      resolve(data);
    });
  });
}

/* handleConnection(); */

export { getOne, list, filterBy, create, update, toggleItemStatus, eliminate };
