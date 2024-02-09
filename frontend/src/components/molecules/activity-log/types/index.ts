export interface ActivityLog {
  title: string;
  summary?: string;
  comment?: string;
  commentLabel?: string;
  commentDisabled?: boolean;
  onCommentUpdate?: (comment: string) => Promise<void>;
  onCommentCancel?: () => void;
  reply?: boolean;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  ctaLink?: string;
  onCtaLinkClick?: () => void;
  ctaButton?: string;
  onCtaButtonClick?: () => Promise<void>;
}

export interface ActivityLogProps {
  activities: ActivityLog[];
}
