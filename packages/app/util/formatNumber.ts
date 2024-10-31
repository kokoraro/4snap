export function formatNumber(number: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
  });

  return formatter.format(number);
}
