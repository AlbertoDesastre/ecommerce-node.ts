import { MysqlError } from "mysql";

import { handleConnection } from "../../store/mysql";
import { ErrorThrower as MysqlErrorThrower } from "../../store/types";
import { ErrorThrower, FilterQueries } from "./types";
import { Product, ProductQueries, TableColumns } from "./models";
import { MysqlQueryResult } from "../../store/types";

class ProductService {
  private connection;
  constructor() {
    this.connection = handleConnection();
  }

  async list({ limit = "15", offset = "0" }) {
    const products = (await this.connection.list({
      table: "products",
      limit,
      offset,
    })) as Product[] | MysqlError;

    return products;
  }

  async filterBy({ name, price, color }: FilterQueries) {
    let conditionsElements: string[] = [];
    let conditions = "";

    if (name) {
      conditionsElements.push(`name LIKE '%${name}%'`);
    }
    if (price) {
      conditionsElements.push(`price <= ${price}`);
    }
    if (color) {
      conditionsElements.push(`color LIKE '%${color}%'`);
    }

    if (conditionsElements.length > 0) {
      conditions = conditionsElements.join(" AND ");
      /* For every filter, an "AND" it's included automatically to concatenate more than one filter if necessary.
        For example, if we had all 3 filters the "conditions" will look like this string: "name LIKE ?  AND price <= ?  AND color LIKE ?"   */
    }

    const result = await this.connection.personalizedQuery(
      ProductQueries.GET_PRODUCTS + ` WHERE ${conditions}`
    );

    if (Array.isArray(result) && result.length === 0)
      throw new Error(ErrorThrower.PRODUCT_NOT_FOUND);

    return result as Product[];
  }

  async getOne(id: string) {
    const result = await this.connection.getOne({
      table: "products",
      tableColumns: TableColumns.PRODUCTS_GET_VALUES,
      id,
      addExtraQuotesToId: true,
    });

    if (Array.isArray(result) && result.length === 0)
      throw new Error(ErrorThrower.PRODUCT_NOT_FOUND);

    return result as Product[];
  }

  async create(productsInArrayOfJsons: Product[]) {
    const data = productsInArrayOfJsons.map((product) => [
      ...Object.values(product),
    ]);

    /* Pending to be corrected. In reality it's not returning products but a message from mysql */
    const result = await this.connection.create({
      table: "products",
      tableColumns: TableColumns.PRODUCTS_POST_VALUES,
      arrayOfData: data,
    });

    return result as MysqlQueryResult;
  }

  async update({ product }: { product: Product }) {
    const productId = product.id.toString();

    const data = await this.connection.update({
      table: "products",
      item: product,
      id: productId,
    });

    if (data.message === MysqlErrorThrower.NO_UPDATE_WAS_MADE)
      throw new Error(ErrorThrower.PRODUCT_COULDNT_UPDATE);

    return data;
  }

  async deactivateProduct({ id }: { id: string }) {
    const result = await this.connection.toggleItemStatus({
      table: "products",
      boolean: "FALSE",
      id,
    });

    return result;
  }
}

export { ProductService };
