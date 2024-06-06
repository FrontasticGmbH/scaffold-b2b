import { Quote } from '@/types/entity/quote';

interface QuoteActionPermissions {
  canAccept?: boolean;
  canDecline?: boolean;
  canRenegotiate?: boolean;
  canRevoke?: boolean;
}

export interface QuoteDetailsPageProps {
  quote?: Quote;
  isQuoteRequest?: boolean;
  viewOnly?: boolean;
  permissions: QuoteActionPermissions;
  onCommentUpdate?: () => Promise<void>;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  onRenegotiate?: (comment: string) => Promise<void>;
  onRevoke?: () => Promise<void>;
  onCheckout?: () => Promise<void>;
  onViewOrder?: () => Promise<void>;
}
