'use client';

export default function FormattedDate({ timestamp }: { timestamp: string }) {
  return (
    <span>
      {new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(timestamp))}
    </span>
  );
}