import { Suspense } from 'react';

import { CollectionsFeed } from '@/components/CollectionsFeed';
import styles from '@/components/Feed.module.css';
import { FeedMessage } from '@/components/FeedMessage';
import { RefreshButton } from '@/components/RefreshButton';

export default function CollectionsPage() {
  return (
    <main>
      <header className={styles.header}>
        <div>
          <h1>Collections</h1>
          <p className={styles.subtitle}>Successful waste collections, newest first.</p>
        </div>
        <RefreshButton />
      </header>
      <Suspense
        fallback={
          <FeedMessage title="Loading collections…" description="Fetching the latest data." />
        }
      >
        <CollectionsFeed />
      </Suspense>
    </main>
  );
}
