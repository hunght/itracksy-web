export function groupItems(
  array: string[],
  fromIndex: number,
  toIndex: number,
): (string | string[])[] {
  if (
    array.length < 4 ||
    fromIndex > toIndex ||
    fromIndex < 0 ||
    toIndex >= array.length
  ) {
    return array; // Return the original array if indices are out of bounds or invalid
  }

  return [
    ...array.slice(0, fromIndex), // Elements before the grouping
    array.slice(fromIndex, toIndex + 1), // Grouped elements
    ...array.slice(toIndex + 1), // Elements after the grouping
  ];
}
