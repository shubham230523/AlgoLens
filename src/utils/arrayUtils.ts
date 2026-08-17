export interface RandomArrayOptions {
  size: number;
  min: number;
  max: number;
  sorted?: boolean;
  reverse?: boolean;
  unique?: boolean;
}

export function generateRandomArray({
  size,
  min,
  max,
  sorted = false,
  reverse = false,
  unique = false,
}: RandomArrayOptions): number[] {
  const arr: number[] = [];
  const range = max - min + 1;

  while (arr.length < size) {
    const val = Math.floor(Math.random() * range) + min;
    if (unique && arr.includes(val)) continue;
    arr.push(val);
  }

  if (sorted) {
    arr.sort((a, b) => a - b);
  } else if (reverse) {
    arr.sort((a, b) => b - a);
  }

  return arr;
}

export function parseInputArray(input: string): number[] {
  return input
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n));
}
