require("dotenv").config();
import mysql, { MysqlError, Query } from "mysql";
import {
  ConnectionMethods,
  CreateParams,
  DeleteParams,
  ErrorThrower,
  FilterByParams,
  GetOneParams,
  ListParams,
  LoginParams,
  MysqlQueryResult,
  ToggleItemStatus,
  UpdateParams,
} from "./types";
import { User } from "../components/user/models";

const dbconf = {
  connectionLimit: 2,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbconf);

function handleConnection(): ConnectionMethods {
  pool.getConnection((err: mysql.MysqlError, connection) => {
    if (err) {
      console.error("[db error]", err.message);
      setTimeout(handleConnection, 2000);
    } else {
      /*       console.log("DB Connected :)"); */
      connection.release();
    }
  });

  pool.on("error", (err) => {
    console.error("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleConnection();
    } else {
      throw err;
    }
  });

  function getOne({
    table,
    tableColumns,
    id,
    addExtraQuotesToId,
  }: GetOneParams): Promise<Object[] | MysqlError> {
    return new Promise((resolve, reject) => {
      if (addExtraQuotesToId) {
        id = "'" + id + "'";
      }
      pool.query(
        `SELECT ${tableColumns} FROM ${table} WHERE id = ${id}`,
        (err, data) => {
          if (err) return reject(err);

          resolve(data);
        }
      );
    });
  }

  function login({
    table,
    username,
    email,
  }: LoginParams): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      // careful!! when searching for real strings you have to put " '' " between words.
      // The function "getOne" works because in reality on the DB it's searching for a number!!
      if (username) {
        pool.query(
          `SELECT id, username, email, password, avatar, token, created_at FROM ${table} WHERE username = '${username}'`,
          (err: MysqlError, data: User[]) => {
            if (err) return reject(err);

            resolve(data[0]);
          }
        );
      } else if (email) {
        pool.query(
          `SELECT id, username, email, password, avatar, token, created_at FROM ${table} WHERE email = '${email}'`,
          (err: MysqlError, data: User[]) => {
            if (err) return reject(err);

            resolve(data[0]);
          }
        );
      }
    });
  }
  function list({
    table,
    limit,
    offset,
  }: ListParams): Promise<Object[] | MysqlError> {
    return new Promise((resolve, reject) => {
      pool.query(
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
      pool.query(query, [...filters], (err, data) => {
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
    tableColumns,
    arrayOfData,
  }: CreateParams): Promise<MysqlQueryResult> {
    return new Promise((resolve, reject) => {
      /*  console.log(table, arrayOfData); */
      pool.query(
        `INSERT INTO ${table} ${tableColumns} VALUES ?`,
        [arrayOfData],
        (err, data: MysqlQueryResult) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY" && table === "users") {
              return reject(ErrorThrower.USER_DUPLICATED);
            }

            if (err.errno === 1452) {
              return reject(
                new Error(
                  ErrorThrower.TRYING_TO_INSERT_NON_EXISTING_FOREIGN_KEY
                )
              );
            }

            return reject(err);
          }

          resolve(data);
        }
      );
    });

    /* This can create some confusion, but in reality mysql library need an array, with an array, with N amounts of arrays which contains
      the information of the Jsons. This mean that the actual data provided to pool.query it's something like...

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
      pool.query(
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
      pool.query(
        `UPDATE ${table} SET active = ${boolean} WHERE id = ${id}`,
        (err: MysqlError, data: MysqlQueryResult) => {
          if (err) return reject(err);

          resolve(data);
        }
      );
    });
  }
  function personalizedQuery(query: string): Promise<Object[] | MysqlError> {
    return new Promise((resolve, reject) => {
      pool.query(query, (err, data) => {
        // console.log(query);
        // console.log("la data de la query --> ", data);
        if (err) return reject(err);

        const orders = data.map((objetFromQuery: Object) => ({
          ...objetFromQuery,
        }));

        resolve(orders);
      });
    });
  }

  function eliminate({
    table,
    id,
    addExtraQuotesToId,
  }: DeleteParams): Promise<MysqlQueryResult> {
    return new Promise((resolve, reject) => {
      if (id === undefined) {
        pool.query(`DELETE FROM ${table}`, (err, data) => {
          if (err) return reject(err);

          resolve(data);
        });
      } else {
        if (addExtraQuotesToId) {
          id = "'" + id + "'";
        }
        pool.query(
          `DELETE FROM ${table} WHERE id = ${id}`,
          (err: MysqlError | null, data: MysqlQueryResult) => {
            /*  console.log(`DELETE FROM ${table} WHERE id = ${id}`); */
            if (err) return reject(err);

            resolve(data);
          }
        );
      }
    });
  }

  function closeConnection() {
    pool.end((err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Connection closed.");
    });
  }

  return {
    getOne,
    login,
    list,
    filterBy,
    create,
    update,
    toggleItemStatus,
    personalizedQuery,
    eliminate,
    closeConnection,
  };
}

export { pool, handleConnection };
