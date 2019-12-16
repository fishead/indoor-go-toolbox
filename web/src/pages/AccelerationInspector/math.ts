export const sum = (n: number[]) => {
  return n.reduce((s, c) => s + c, 0);
};

export const count = (n: number[]) => {
  return n.length;
};

export const mean = (n: number[]) => {
  return sum(n) / count(n);
};

export const sigma = (n: number[]) => {
  if (count(n) === 0) {
    return 0;
  }
  const m = mean(n);
  return Math.sqrt(sum(n.map(i => (i - m) ** 2)));
};
