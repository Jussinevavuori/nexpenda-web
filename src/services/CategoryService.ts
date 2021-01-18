import { Service } from "./Service";
import { Success } from "../result/Success";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";
import { Category, JsonCategory } from "../classes/Category";

export class CategoryService extends Service {
  /**
   * Get all categories for user as Result
   */
  static async getCategories() {
    const result = await Service.get("/categories", {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Category.isJsonArray(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonCategory[]>(
        result.value,
        "categories/get"
      );
    }
  }
}
