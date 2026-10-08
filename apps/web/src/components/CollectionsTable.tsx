import type { Collection } from '@waste-collection/types';

import { formatTimestamp, formatWeight } from '@/lib/format';

import styles from './CollectionsTable.module.css';

interface Props {
  collections: Collection[];
}

export function CollectionsTable({ collections }: Props) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">QR ID</th>
            <th scope="col" className={styles.numeric}>
              Weight
            </th>
            <th scope="col" className={styles.numeric}>
              Points Allocated
            </th>
            <th scope="col">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection.id}>
              <td className={styles.qrId}>{collection.qr_id}</td>
              <td className={styles.numeric}>{formatWeight(collection.weight)}</td>
              <td className={styles.numeric}>{collection.points}</td>
              <td>
                <time dateTime={collection.timestamp}>{formatTimestamp(collection.timestamp)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
