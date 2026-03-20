import { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { StepIndicator } from './create/StepIndicator';
import { Step1Category } from './create/Step1Category';
import { Step2Details, type Step2Data } from './create/Step2Details';
import { Step3Attributes } from './create/Step3Attributes';
import { Step4Review } from './create/Step4Review';
import { LivePreviewCard } from './create/LivePreviewCard';
import { QualityScoreChecklist } from './create/QualityScoreChecklist';
import { computeQualityScore, type ScoreInput } from './hooks/useQualityScore';
import { useCreateDemande } from '../../hooks/useDemandeMutations';
import { useCategoryAttributes } from '../../hooks/useCategories';

interface SelectedCategory {
  id: number;
  name: string;
  path: string;
  depth: number;
}

interface FreeAttribute {
  key: string;
  value: string;
}

export function CreateDemandePage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [category, setCategory] = useState<SelectedCategory | null>(null);
  const [details, setDetails] = useState<Step2Data>({
    title: '',
    description: '',
    quantity: '',
    unit: 'pièces',
    deadline: '',
    wilaya: '',
    file: null,
  });
  const [schemaAttributes, setSchemaAttributes] = useState<Record<string, string>>({});
  const [freeAttributes, setFreeAttributes] = useState<FreeAttribute[]>([]);

  const createMutation = useCreateDemande();
  const { data: categoryAttrs } = useCategoryAttributes(category?.id ?? null);

  const deadlineDays = details.deadline
    ? differenceInDays(new Date(details.deadline), new Date())
    : 0;

  const requiredAttributesFilled = categoryAttrs
    ? categoryAttrs.filter(a => a.required).every(a => {
        const val = schemaAttributes[a.key];
        return val !== undefined && val !== '';
      })
    : true;

  const scoreInput: ScoreInput = {
    categoryId: category?.id ?? null,
    categoryDepth: category?.depth ?? 0,
    requiredAttributesFilled,
    freeAttributesCount: freeAttributes.filter(a => a.key && a.value).length,
    description: details.description,
    deadlineDays,
    hasFile: details.file !== null,
  };

  const score = computeQualityScore(scoreInput);

  const handleSchemaChange = (key: string, value: string) => {
    setSchemaAttributes(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!category) return;
    createMutation.mutate({
      title: details.title,
      description: details.description || undefined,
      quantity: parseFloat(details.quantity),
      unit: details.unit,
      deadline: details.deadline,
      categoryId: category.id,
      wilaya: details.wilaya,
      attributes: [
        ...Object.entries(schemaAttributes)
          .filter(([, v]) => v)
          .map(([key, value]) => ({ key, value, custom: false })),
        ...freeAttributes
          .filter(a => a.key && a.value)
          .map(({ key, value }) => ({ key, value, custom: true })),
      ],
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          Nouvelle demande
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Publiez votre besoin et recevez des réponses de fournisseurs qualifiés.</p>
      </div>

      <StepIndicator currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {step === 1 && (
            <Step1Category
              selected={category}
              onSelect={setCategory}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2Details
              data={details}
              onChange={setDetails}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3Attributes
              categoryId={category?.id ?? 0}
              schemaValues={schemaAttributes}
              onSchemaChange={handleSchemaChange}
              freeAttributes={freeAttributes}
              onFreeChange={setFreeAttributes}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <Step4Review
              category={category}
              details={details}
              schemaAttributes={schemaAttributes}
              freeAttributes={freeAttributes}
              scoreInput={scoreInput}
              onSubmit={handleSubmit}
              onBack={() => setStep(3)}
              isSubmitting={createMutation.isPending}
            />
          )}
        </div>

        {/* Preview - sticky, steps 2+ */}
        {step >= 2 && (
          <div className="lg:col-span-2 space-y-4">
            <div className="sticky top-24 space-y-4">
              <LivePreviewCard
                title={details.title}
                categoryPath={category?.path ?? ''}
                quantity={details.quantity}
                unit={details.unit}
                deadline={details.deadline}
                wilaya={details.wilaya}
                score={score}
              />
              {step >= 3 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <QualityScoreChecklist input={scoreInput} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
