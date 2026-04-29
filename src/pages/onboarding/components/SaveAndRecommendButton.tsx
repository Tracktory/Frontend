import React from 'react';

import { Button } from '../../../components/Button';

interface SaveAndRecommendButtonProps {
  onPress: () => void;
}

export function SaveAndRecommendButton({ onPress }: SaveAndRecommendButtonProps) {
  return <Button title="저장하고 추천받기" variant="primary" onPress={onPress} />;
}
