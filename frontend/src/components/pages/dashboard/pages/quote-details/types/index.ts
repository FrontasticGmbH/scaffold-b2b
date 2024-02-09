import { Quote } from '@/types/entity/quote';

export interface QuoteDetailsPageProps {
  quote?: Quote;
  isQuoteRequest?: boolean;
  onCommentUpdate?: () => Promise<void>;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  onRenegotiate?: (comment: string) => Promise<void>;
  onRevoke?: () => Promise<void>;
  onCheckout?: () => Promise<void>;
  onViewOrder?: () => Promise<void>;
}
