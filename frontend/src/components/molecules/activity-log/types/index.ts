export interface ActivityLog {
  title: string;
  summary?: string;
  comment?: string;
  commentLabel?: string;
  commentDisabled?: boolean;
  onCommentUpdate?: (comment: string) => Promise<void>;
  onCommentCancel?: () => void;
  reply?: boolean;
  canAccept?: boolean;
  canReject?: boolean;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  ctaLink?: string;
  ctaLinkIsDisabled?: boolean;
  onCtaLinkClick?: () => void;
  ctaButton?: string;
  ctaButtonIsDisabled?: boolean;
  onCtaButtonClick?: () => Promise<void>;
}

export interface ActivityLogProps {
  activities: ActivityLog[];
  translations?: {
    accept?: string;
    decline?: string;
    cancel?: string;
    send?: string;
  };
}
