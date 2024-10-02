import React, { useState } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import TextArea from '@/components/atoms/text-area';
import Button from '@/components/atoms/button';
import { ActivityLogProps } from './types';

const ActivityLog = ({ activities, translations = {} }: ActivityLogProps) => {
  const { translate } = useTranslation();

  const [commentValue, setCommentValue] = useState<Record<number, string>>({});

  const [commentLength, setCommentLength] = useState<Record<number, number>>({});

  const [commentProcessing, setCommentProcessing] = useState<Record<number, boolean>>({});

  const [commentFocused, setCommentFocused] = useState<Record<number, boolean>>({});

  const maximumCommentCharacters = 160;

  const [replyProcessing, setReplyProcessing] = useState<Record<number, boolean>>({});

  const [declineProcessing, setDeclineProcessing] = useState<Record<number, boolean>>({});

  const [actionProcessing, setActionProcess] = useState<Record<number, boolean>>({});

  return (
    <div className="flex flex-col">
      {activities.map(
        (
          {
            title,
            summary,
            comment,
            commentLabel,
            commentDisabled,
            onCommentUpdate,
            onCommentCancel,
            reply,
            canAccept,
            canReject,
            onAccept,
            onReject,
            ctaLink,
            ctaLinkIsDisabled,
            onCtaLinkClick,
            ctaButton,
            ctaButtonIsDisabled,
            onCtaButtonClick,
          },
          index,
          arr,
        ) => (
          <div
            key={index}
            data-testid="activity-log"
            className={classnames('relative pb-9 pl-6 lg:pb-12', {
              'border-l border-neutral-400': index < arr.length - 1,
            })}
          >
            <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/4 rounded-full bg-white p-2">
              <div className="size-[20px] rounded-full bg-[#778DA9]" />
            </div>

            <h5 className="leading-tight text-gray-700">{title}</h5>

            {summary && <h6 className="mt-2 text-12 text-gray-600">{summary}</h6>}

            {comment && (
              <form
                role="form"
                className="mt-7"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setCommentProcessing({ ...commentProcessing, [index]: true });
                  if (commentValue[index]) await onCommentUpdate?.(commentValue[index]);
                  setCommentProcessing({ ...commentProcessing, [index]: false });
                  setCommentFocused({ ...commentFocused, [index]: false });
                  (document.activeElement as HTMLTextAreaElement).blur();
                }}
              >
                <h5 className="text-12 font-medium uppercase text-gray-600">{commentLabel}</h5>
                <TextArea
                  defaultValue={comment ?? ''}
                  className={classnames('mt-3 max-w-[350px]', {
                    'pointer-events-none cursor-default': commentDisabled,
                  })}
                  style={{ height: ctaLink ? 150 : 45 }}
                  fitContent={!ctaLink}
                  error={
                    commentLength[index] && commentLength[index] > maximumCommentCharacters
                      ? translate('dashboard.message.too.long', {
                          values: { maxCharacters: maximumCommentCharacters.toString() },
                        })
                      : ''
                  }
                  onChange={(e) => {
                    setCommentValue({ ...commentValue, [index]: e.target.value });
                    setCommentLength({ ...commentLength, [index]: e.target.value.length });
                  }}
                  onFocus={() => setCommentFocused({ ...commentFocused, [index]: !commentDisabled })}
                  onBlur={() => setCommentFocused({ ...commentFocused, [index]: false })}
                />
                {commentFocused[index] && (
                  <div className="mt-9 flex gap-3">
                    <Button
                      variant="secondary"
                      size="l"
                      onClick={onCommentCancel}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {translations.cancel || translate('common.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      size="l"
                      variant="primary"
                      disabled={!!(commentLength[index] && commentLength[index] > maximumCommentCharacters)}
                      loading={commentProcessing[index]}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {translations.send || translate('common.send')}
                    </Button>
                  </div>
                )}
              </form>
            )}

            {reply && (
              <div className="mt-7 flex gap-3">
                <Button
                  variant="secondary"
                  size="l"
                  className="leading-[16px]"
                  loading={declineProcessing[index]}
                  disabled={!canReject}
                  onClick={async () => {
                    setDeclineProcessing({ ...declineProcessing, [index]: true });
                    await onReject?.();
                    setDeclineProcessing({ ...declineProcessing, [index]: false });
                  }}
                >
                  {translations.decline || translate('common.decline')}
                </Button>
                <Button
                  variant="primary"
                  size="l"
                  className="py-[12px] leading-[16px]"
                  loading={replyProcessing[index]}
                  disabled={!canAccept}
                  onClick={async () => {
                    setReplyProcessing({ ...replyProcessing, [index]: true });
                    await onAccept?.();
                    setReplyProcessing({ ...replyProcessing, [index]: false });
                  }}
                >
                  {translations.accept || translate('common.accept')}
                </Button>
              </div>
            )}

            {ctaButton && (
              <div className="mt-7">
                <Button
                  variant="primary"
                  size="l"
                  className="w-full max-w-[350px] py-[12px] leading-[16px]"
                  loading={actionProcessing[index]}
                  disabled={ctaButtonIsDisabled}
                  onClick={async () => {
                    setActionProcess({ ...actionProcessing, [index]: true });
                    await onCtaButtonClick?.();
                    setActionProcess({ ...actionProcessing, [index]: false });
                  }}
                >
                  {ctaButton}
                </Button>
              </div>
            )}

            {ctaLink && !ctaLinkIsDisabled && (
              <span
                className="mt-5 block cursor-pointer text-14 text-[#274082] underline underline-offset-2"
                onClick={onCtaLinkClick}
              >
                {ctaLink}
              </span>
            )}
          </div>
        ),
      )}
    </div>
  );
};

export default ActivityLog;
