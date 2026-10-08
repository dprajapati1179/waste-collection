'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import styles from './Feed.module.css';

interface Props {
  label?: string;
}

export function RefreshButton({ label = 'Refresh' }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={styles.button}
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {isPending ? 'Refreshing…' : label}
    </button>
  );
}
