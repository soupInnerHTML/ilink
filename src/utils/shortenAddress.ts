export const shortenAddress = (address: string, charsStart: number = 4, charsEnd: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, charsStart)}...${address.slice(-charsEnd)}`;
};