/**
 * Chunkifies an array to a two-dimensional array
 */
export function chunkify<T>(array: T[], chunkSize: number): Array<T[]> {
  const chunks: Array<T[]> = [];

  array.forEach((item) => {
    const lastChunk = chunks[chunks.length - 1];

    if (!lastChunk || lastChunk.length === chunkSize) {
      chunks.push([item]);
    } else {
      lastChunk.push(item);
    }
  });

  return chunks;
}
