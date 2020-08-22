export type ServerError = {
  code: string;
  status: number;
  message: string;
};

export function toServerError(arg: any): ServerError {
  return {
    code: String(arg?.code),
    status: Number(arg?.status),
    message: String(arg?.message),
  };
}

export function isServerError(arg: any): arg is ServerError {
  return (
    arg &&
    typeof arg === "object" &&
    typeof arg.code === "string" &&
    typeof arg.status === "number" &&
    typeof arg.message === "string"
  );
}
