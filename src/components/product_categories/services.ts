import { MysqlError } from "mysql";

import { handleConnection } from "../../store/mysql";
import { FilterQueries, Category } from "./types";
import { MysqlQueryResult, GeneralUseTableColumns } from "../../store/types";

class CategoryService {
  private connection;

  constructor() {
    this.connection = handleConnection();
  }

  async list({ limit = "15", offset = "0" }) {
    const categories = (await this.connection.list({
      table: "categories",
      limit,
      offset,
    })) as Category[] | MysqlError;

    return categories;
  }

  async filterBy({ name }: FilterQueries) {
    const result = await this.connection.filterBy({
      table: "categories",
      conditions: "name LIKE ?",
      filters: [`%${name}%`],
    });

    console.log(result);

    return result;
  }

  async getOne(id: string) {
    return await this.connection.getOne({
      table: "categories",
      tableColumns: GeneralUseTableColumns.CATEGORIES_GET_VALUES,
      id,
      addExtraQuotesToId: true,
    });
  }

  async create(categoriesInArrayOfJsons: Category[]) {
    const data = categoriesInArrayOfJsons.map((category) => {
      if (!category.active) category.active = 0;
      return [...Object.values(category)];
    });

    console.log(data);

    const result = await this.connection.create({
      table: "categories",
      tableColumns: GeneralUseTableColumns.CATEGORIES_POST_VALUES,
      arrayOfData: data,
    });

    return result as MysqlQueryResult;
  }

  async update({ category: category }: { category: Category }) {
    const categoryId = category.id.toString();

    const data = await this.connection.update({
      table: "categories",
      item: category,
      id: categoryId,
    });

    return data;
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
