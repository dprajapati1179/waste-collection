import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCollection, selectWeightValidation } from '../store/selectors';
import { collectionReset, weightChanged } from '../store/slices/collectionSlice';
import { submitCollection } from '../store/thunks/submitCollection';
import { Button } from './Button';
import { ScanResult } from './ScanResult';
import { SubmissionMessage } from './SubmissionMessage';
import { WeightForm } from './WeightForm';

interface Props {
  qrId: string;
}

export function CollectionEntry({ qrId }: Props) {
  const dispatch = useAppDispatch();
  const { status, weight, error } = useAppSelector(selectCollection);
  const weightValidation = useAppSelector(selectWeightValidation);

  const submitting = status === 'submitting';
  const isDuplicate = error?.kind === 'duplicate';

  return (
    <>
      <ScanResult qrId={qrId} />
      {!isDuplicate && (
        <WeightForm
          weight={weight}
          error={weightValidation.valid ? null : weightValidation.error}
          submitting={submitting}
          submitLabel={status === 'error' ? 'Retry' : 'Submit'}
          onChange={(value) => dispatch(weightChanged(value))}
          onSubmit={() => dispatch(submitCollection())}
        />
      )}
      <SubmissionMessage submitting={submitting} error={error} />
      <Button
        label={isDuplicate ? 'Scan another bag' : 'Scan again'}
        variant={isDuplicate ? 'primary' : 'secondary'}
        disabled={submitting}
        onPress={() => dispatch(collectionReset())}
      />
    </>
  );
}
