type ChildArgument =
  | string
  | number
  | boolean
  | {}
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactNodeArray
  | React.ReactPortal
  | null
  | undefined;

export function getChildComponentName(
  child: ChildArgument
): string | undefined {
  // Ensure child is an object
  if (!child || typeof child !== "object") {
    return "primitive";
  }

  try {
    const _c = child as any;
    if (
      "type" in _c &&
      "options" in _c["type"] &&
      "name" in _c["type"]["options"] &&
      typeof _c["type"]["options"]["name"] === "string"
    ) {
      return _c["type"]["options"]["name"];
    }
  } catch (e) {
    console.error(e);
  } finally {
    return undefined;
  }
}
