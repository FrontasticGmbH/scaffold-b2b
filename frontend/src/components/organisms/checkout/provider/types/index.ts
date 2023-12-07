export interface CheckoutProviderShape {
  activeStep: number;
  isLastStep: boolean;
  nextStep: () => void;
  resetStepTo: (step: number) => void;
  tempData: Record<string, string>;
  setTempData: (data: Record<string, string>) => void;
  visitedAllSteps: boolean;
  goToLastStep: () => void;
}
