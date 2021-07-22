/**
 * Initializer type describes the type and omits the fields which are
 * provided by the server and must thus not be sent to the server.
 */
type ObjectInitializer<T extends {}> = Omit<
  T,
  "id" | "uid" | "createdAt" | "updatedAt"
>;

/**
 * Maps an object type into an initializer type which is used for posting
 * to the server
 */
type PostableObject<T extends {}> = ObjectInitializer<T>;

/**
 * Maps an object type into an initializer type and attaches an ID for
 * upserting to the server
 */
type PuttableObject<T extends {}> = ObjectInitializer<T> & {
  id: string;
};

/**
 * Maps an object type into a partial initializer type and attaches an ID
 * for updating to the server
 */
type PatchableObject<T extends {}> = Partial<ObjectInitializer<T>> & {
  id: string;
};
