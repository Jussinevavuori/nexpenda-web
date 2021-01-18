import { object, string, ObjectSchema } from "yup";

export type JsonCategory = {
  id: string;
  uid: string;
  value: string;
  incomeIcon: string;
  expenseIcon: string;
};

export class Category {
  public id: string;
  public uid: string;
  public value: string;
  public incomeIcon: string;
  public expenseIcon: string;

  constructor(json: JsonCategory) {
    this.id = json.id;
    this.uid = json.uid;
    this.value = json.value;
    this.incomeIcon = json.incomeIcon || "💰";
    this.expenseIcon = json.expenseIcon || "💸";
  }

  /**
   * JsonSchema defining shape of JsonCategories for yup validation
   */
  static JsonSchema: ObjectSchema<JsonCategory> = object({
    id: string().required(),
    uid: string().required(),
    value: string().min(1).required(),
    incomeIcon: string().required(),
    expenseIcon: string().required(),
  }).required();

  /**
   * Is the value a valid JsonTransaction
   */
  static isJson(arg: any): arg is JsonCategory {
    try {
      Category.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Is the value an array of valid JsonTransactions
   */
  static isJsonArray(arg: any): arg is JsonCategory[] {
    return Array.isArray(arg) && arg.every(Category.isJson);
  }

  /**
   * Convert Transaction to JsonTransaction
   */
  toJson(): JsonCategory {
    return {
      id: this.id,
      uid: this.uid,
      value: this.value,
      incomeIcon: this.incomeIcon,
      expenseIcon: this.expenseIcon,
    };
  }
}

export const DefaultCategory = new Category({
  id: "undefined",
  uid: "undefined",
  value: "Loading...",
  incomeIcon: "💰",
  expenseIcon: "💸",
});
