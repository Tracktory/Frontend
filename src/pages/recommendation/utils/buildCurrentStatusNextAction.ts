import { getNextActionMessageForRecommendationId } from '../data/currentStatusNextActionMock';

export function buildCurrentStatusNextAction(
  recommendationId: number | null | undefined,
): string {
  return getNextActionMessageForRecommendationId(recommendationId);
}
