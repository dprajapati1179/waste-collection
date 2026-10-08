const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

export function formatTimestamp(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} kg`;
}
