import classnames from "classnames";

type ClassnamesArgs = Parameters<typeof classnames>;

export function createClassnames(...defaults: ClassnamesArgs) {
  return function (...classes: ClassnamesArgs) {
    return classnames(...defaults, ...classes);
  };
}
