export function formatArea(sqMeters: number): string {
  return `${sqMeters.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
