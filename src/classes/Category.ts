import { object, string, ObjectSchema } from "yup";

export type JsonCategory = {
  id: string;
  value: string;
  incomeIcon: string;
  expenseIcon: string;
};

export type CompressedJsonCategory = {
  id: string;
  v: string;
  ii: string;
  ei: string;
};

export class Category {
  public id: string;
  public value: string;
  public incomeIcon: string;
  public expenseIcon: string;

  constructor(json: JsonCategory) {
    this.id = json.id;
    this.value = json.value;
    this.incomeIcon = json.incomeIcon || "💰";
    this.expenseIcon = json.expenseIcon || "💸";
  }

  /**
   * JsonSchema defining shape of JsonCategories for yup validation
   */
  static JsonSchema: ObjectSchema<JsonCategory> = object({
    id: string().required(),
    value: string().required(),
    incomeIcon: string().required(),
    expenseIcon: string().required(),
  }).required();

  /**
   * JsonSchema defining shape of Compressed JsonCategories for yup validation
   */
  static CompressedJsonSchema: ObjectSchema<CompressedJsonCategory> = object({
    id: string().required(),
    v: string().required(),
    ii: string().required(),
    ei: string().required(),
  }).required();

  /**
   * Is the value a valid JsonCategory
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
   * Is the value a valid Compressed JsonCategory
   */
  static isCompressedJson(arg: any): arg is CompressedJsonCategory {
    try {
      Category.CompressedJsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Is the value an array of valid JsonCategories
   */
  static isJsonArray(arg: any): arg is JsonCategory[] {
    return Array.isArray(arg) && arg.every(Category.isJson);
  }

  /**
   * Is the value an array of valid Compressed JsonCategories
   */
  static isCompressedJsonArray(arg: any): arg is CompressedJsonCategory[] {
    return Array.isArray(arg) && arg.every(Category.isCompressedJson);
  }

  /**
   * Convert Category to JsonCategory
   */
  toJson(): JsonCategory {
    return {
      id: this.id,
      value: this.value,
      incomeIcon: this.incomeIcon,
      expenseIcon: this.expenseIcon,
    };
  }

  /**
   * Convert Category to Compressed JsonCategory
   */
  toCompressedJson(): CompressedJsonCategory {
    return {
      id: this.id,
      v: this.value,
      ii: this.incomeIcon,
      ei: this.expenseIcon,
    };
  }

  /**
   * Create from Compressed
   */
  static fromCompressed(c: CompressedJsonCategory): Category {
    return new Category({
      id: c.id,
      value: c.v,
      expenseIcon: c.ei,
      incomeIcon: c.ii,
    });
  }
}

export const DefaultCategory = new Category({
  id: "undefined",
  value: "Loading...",
  incomeIcon: "💰",
  expenseIcon: "💸",
});
