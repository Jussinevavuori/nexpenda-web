import { Failure } from "../Result/Result";

export class InvalidServerResponseFailure<T> extends Failure<
  T,
  "invalidServerResponse"
> {
  public readonly response: any;
  public readonly method: string;

  constructor(response: any, method: string) {
    super("invalidServerResponse");
    this.response = response;
    this.method = method;
  }
}
