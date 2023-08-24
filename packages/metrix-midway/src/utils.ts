export const normalizedBitInt = (value: string | bigint | number) => {
  if (typeof value === 'string' || typeof value === 'bigint') {
    return BigInt(value);
  }
  return BigInt(value.toFixed());
};
