import { Quote } from '@/types/entity/quote';

export interface QuoteDetailsPageProps {
  quote?: Quote;
  onCommentUpdate?: () => Promise<void>;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  onRenegotiate?: () => Promise<void>;
  onRevoke?: () => Promise<void>;
}
