export interface ScoreInput {
  categoryId: number | null;
  categoryDepth: number;
  requiredAttributesFilled: boolean;
  freeAttributesCount: number;
  description: string;
  deadlineDays: number;
  hasFile: boolean;
}

export interface ScoreItem {
  label: string;
  points: number;
  earned: boolean;
}

export function getScoreItems(input: ScoreInput): ScoreItem[] {
  return [
    { label: 'Catégorie sélectionnée', points: 20, earned: input.categoryId !== null },
    { label: 'Profondeur de catégorie ≥ 3', points: 10, earned: input.categoryDepth >= 3 },
    { label: 'Attributs obligatoires remplis', points: 25, earned: input.requiredAttributesFilled },
    { label: '2+ attributs libres ajoutés', points: 10, earned: input.freeAttributesCount >= 2 },
    { label: 'Description ≥ 50 caractères', points: 15, earned: input.description.length >= 50 },
    { label: 'Délai > 3 jours', points: 10, earned: input.deadlineDays > 3 },
    { label: 'Fichier joint', points: 10, earned: input.hasFile },
  ];
}

export function computeQualityScore(input: ScoreInput): number {
  return Math.min(getScoreItems(input).filter(i => i.earned).reduce((sum, i) => sum + i.points, 0), 100);
}
