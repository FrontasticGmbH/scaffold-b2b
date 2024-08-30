export interface CheckoutProviderShape {
  isCtCheckoutEnabled?: boolean;
  checkoutIsProcessing: boolean;
  setCheckoutIsProcessing: (processing: boolean) => void;
  activeStep: number;
  isLastStep: boolean;
  nextStep: () => void;
  resetStepTo: (step: number) => void;
  tempData: Record<string, string>;
  setTempData: (data: Record<string, string>) => void;
  visitedAllSteps: boolean;
  goToLastStep: () => void;
}
