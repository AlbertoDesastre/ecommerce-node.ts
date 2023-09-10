import { MysqlError } from "mysql";

import { handleConnection } from "../../store/mysql";
import { ErrorThrower, FilterQueries } from "./types";
import { Category, TableColumns } from "./models";
import { MysqlQueryResult, SuccessfulQueryMessage } from "../../store/types";
import { ErrorThrower as MysqlErrorThrower } from "../../store/types";

class CategoryService {
  private connection;

  constructor() {
    this.connection = handleConnection();
  }

  async list({ limit = "15", offset = "0" }) {
    const categories = await this.connection.list({
      table: "categories",
      limit,
      offset,
    });

    return categories as Category[];
  }

  async filterBy({ name }: FilterQueries) {
    const result = await this.connection.filterBy({
      table: "categories",
      conditions: "name LIKE ?",
      filters: [`%${name}%`],
    });

    if (Array.isArray(result) && result.length === 0)
      throw new Error(ErrorThrower.CATEGORY_NOT_FOUND);

    return result as Category[];
  }

  async getOne(id: string) {
    const result = await this.connection.getOne({
      table: "categories",
      tableColumns: TableColumns.CATEGORIES_GET_VALUES,
      id,
      addExtraQuotesToId: true,
    });

    if (Array.isArray(result) && result.length === 0)
      throw new Error(ErrorThrower.CATEGORY_NOT_FOUND);

    return result as Category[];
  }

  async create(categoriesInArrayOfJsons: Category[]) {
    const data = categoriesInArrayOfJsons.map((category) => {
      // for cases where the active attribute it's undefined
      if (!category.active) category.active = 0;
      return [...Object.values(category)];
    });

    const result = await this.connection.create({
      table: "categories",
      tableColumns: TableColumns.CATEGORIES_POST_VALUES,
      arrayOfData: data,
    });

    if (result instanceof Error) throw new Error(result.message);

    return SuccessfulQueryMessage.ITEM_WERE_CREATED;
  }

  async update({ category: category }: { category: Category }) {
    const categoryId = category.id.toString();

    const result = await this.connection.update({
      table: "categories",
      item: category,
      id: categoryId,
    });

    if (result.message === MysqlErrorThrower.ITEM_WASNT_FOUND)
      throw new Error(ErrorThrower.CATEGORY_NOT_FOUND);

    if (result.message === MysqlErrorThrower.NO_UPDATE_WAS_MADE)
      throw new Error(ErrorThrower.CATEGORY_REMAIN_THE_SAME);

    return SuccessfulQueryMessage.ITEM_WAS_UPDATED;
  }

  async deactivateCategory({ id }: { id: string }) {
    const result = await this.connection.toggleItemStatus({
      table: "categories",
      boolean: "FALSE",
      id,
    });

    return result;
  }
}

export { CategoryService };
