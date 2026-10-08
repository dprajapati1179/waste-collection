import type { Collection } from '@waste-collection/types';
import { connection } from 'next/server';

import { getCollections } from '@/lib/collectionsApi';

import { CollectionsTable } from './CollectionsTable';
import { FeedMessage } from './FeedMessage';
import { RefreshButton } from './RefreshButton';

export async function CollectionsFeed() {
  await connection();

  let collections: Collection[];
  try {
    collections = await getCollections();
  } catch (err) {
    console.error(err);
    return (
      <FeedMessage
        tone="error"
        title="Unable to load collections"
        description="The collections service could not be reached. Check that the API is running and try again."
        action={<RefreshButton label="Try again" />}
      />
    );
  }

  if (collections.length === 0) {
    return (
      <FeedMessage
        title="No collections yet"
        description="Completed collections from the mobile app will appear here."
      />
    );
  }

  return <CollectionsTable collections={collections} />;
}
