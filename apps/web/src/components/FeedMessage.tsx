import type { ReactNode } from 'react';

import styles from './Feed.module.css';

interface Props {
  title: string;
  description: string;
  tone?: 'neutral' | 'error';
  action?: ReactNode;
}

export function FeedMessage({ title, description, tone = 'neutral', action }: Props) {
  return (
    <div
      className={tone === 'error' ? styles.error : styles.message}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <p className={styles.title}>{title}</p>
      <p>{description}</p>
      {action}
    </div>
  );
}
