import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

const useCandidates = () => {
  const candidates = useQuery(api.candidates.getAll);

  return candidates
}

export default useCandidates
