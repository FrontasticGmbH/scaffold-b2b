import React, { useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import ActivityLog from '@/components/molecules/activity-log';
import Image from '@/components/atoms/Image';
import useFormat from '@/hooks/useFormat';
import InfoBanner from '@/components/molecules/info-banner';
import { QuoteDetailsPageProps } from './types';
import QuoteStatusTag from '../../components/quote-status-tag';
import PreviousPageLink from '../../components/previous-page-link';

const QuoteDetailsPage = ({
  quote,
  isQuoteRequest,
  viewOnly = false,
  permissions,
  onAccept,
  onCommentUpdate,
  onReject,
  onRenegotiate,
  onRevoke,
  onViewOrder,
}: QuoteDetailsPageProps) => {
  const { translate } = useTranslation();

  const { formatCurrency, formatLocalDate } = useFormat();

  const [isRenegotiating, setIsRenegotiating] = useState<Record<number, boolean>>({});

  if (!quote) return <></>;

  return (
    <div>
      {viewOnly && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view.only')}</b>{' '}
          {translate(isQuoteRequest ? 'dashboard.quote.requests.view.only.desc' : 'dashboard.quotes.view.only.desc')}
        </InfoBanner>
      )}

      <div className="flex items-center justify-between py-6 md:py-7 lg:py-9">
        <h1 className="text-18 font-extrabold leading-tight text-gray-800 md:text-20 lg:text-24">
          {translate(isQuoteRequest ? 'dashboard.quote.request.details' : 'dashboard.quote.details')}
        </h1>
        <PreviousPageLink className="hidden md:block" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-[80px] lg:grid-cols-3 lg:gap-x-[120px]">
        <h3 className="text-14 text-gray-600 lg:order-1">
          {translate(isQuoteRequest ? 'dashboard.quote.request.id' : 'dashboard.quote.id')}: {quote.id}
        </h3>

        <h3 className="text-14 text-gray-600 lg:order-2">
          {translate('dashboard.creation.date')}: {quote.creationDate ? formatLocalDate(quote.creationDate) : '-'}
        </h3>

        {quote.purchaseOrderNumber && (
          <h3 className="text-14 text-gray-600 lg:order-2">
            {translate('dashboard.purchase.order.number')}: {quote.purchaseOrderNumber}
          </h3>
        )}

        <h3 className="flex items-center gap-2 lg:order-4">
          <span className="text-14 text-gray-600">{translate('common.status')}:</span>
          <QuoteStatusTag status={quote.status} />
        </h3>

        <h3 className="text-14 text-gray-600 lg:order-5">
          {translate('dashboard.owner')}: {quote.author}
        </h3>

        <h3 className="text-14 text-gray-600 lg:order-3">
          {translate('dashboard.last.modified.date')}:{' '}
          {quote.lastModifiedDate ? formatLocalDate(quote.lastModifiedDate) : '-'}
        </h3>
      </div>

      <div className="mt-6 border-y border-neutral-400 pb-9">
        <h5 className="pb-7 pt-6 text-gray-700">{translate('common.activity')}</h5>

        <div className="pl-[10px]">
          <ActivityLog
            activities={quote.activity.map(
              (
                { title, titleValues, date, author, comment, commentBy, reply, renegotiate, revoke, viewOrder },
                index,
              ) => ({
                title: translate(title, { values: titleValues }),
                summary: date || author ? `${date ?? ''} - ${translate('common.by')} ${author ?? ''}` : '',
                comment: comment || (isRenegotiating[index] ? ' ' : undefined),
                commentLabel: `${translate('common.comment.by')} ${translate(
                  commentBy === 'author' || isRenegotiating[index] ? 'common.buyer' : 'common.seller',
                )}`,
                commentDisabled: !renegotiate || viewOnly,
                onCommentUpdate: onCommentUpdate ?? (renegotiate ? onRenegotiate : undefined),
                onCommentCancel: () => setIsRenegotiating({ ...isRenegotiating, [index]: false }),
                ...(!viewOnly
                  ? {
                      reply: reply && !isRenegotiating[index],
                      canAccept: permissions.canAccept,
                      canReject: permissions.canDecline,
                      onAccept,
                      onReject,
                      ctaLink:
                        renegotiate || revoke
                          ? translate(`dashboard.cta.${renegotiate ? 'renegotiate' : 'revoke'}`)
                          : '',
                      ctaLinkIsDisabled: renegotiate ? !permissions.canRenegotiate : !permissions.canRevoke,
                      onCtaLinkClick:
                        renegotiate || revoke
                          ? renegotiate
                            ? () => setIsRenegotiating({ ...isRenegotiating, [index]: true })
                            : onRevoke
                          : undefined,
                    }
                  : {}),
                ...(viewOrder
                  ? {
                      ctaButton: translate('dashboard.view.order.details'),
                      ctaButtonIsDisabled: viewOnly,
                      onCtaButtonClick: onViewOrder,
                    }
                  : {}),
              }),
            )}
            translations={{
              accept: translate('dashboard.accept.and.place.order'),
            }}
          />
        </div>
      </div>

      <div>
        <h5 className="pb-7 pt-6 text-gray-700">
          {translate('dashboard.items.quoted')} <span className="text-gray-600">({quote.items.length})</span>
        </h5>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead>
              <tr className="p-4 text-12 uppercase text-gray-500 shadow-[0px_-1px_0px_0px_#E4E4E7_inset]">
                <th className="p-4 text-left font-semibold">{translate('common.product')}</th>
                <th className="p-4 text-left font-semibold">{translate('common.sku')}</th>
                <th className="p-4 text-right font-semibold">{translate('common.qty')}</th>
                <th className="p-4 text-right font-semibold">{translate('common.price')}</th>
                <th className="p-4 text-right font-semibold">{translate('common.total')}</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map(({ id, images, name, sku, quantity, price, discountedPrice, currency }) => (
                <tr key={id} className="p-4 text-14 text-gray-600 shadow-[0px_-1px_0px_0px_#E4E4E7_inset]">
                  <td className="whitespace-pre p-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="relative block size-[40px]">
                        <Image src={images?.[0]} fill alt={name ?? ''} />
                      </span>
                      <span>{name}</span>
                    </div>
                  </td>
                  <td className="whitespace-pre p-4 text-left">{sku}</td>
                  <td className="p-4 text-right">{quantity}</td>
                  <td className="p-4 text-right">
                    {discountedPrice ? (
                      <>
                        <span className="mr-2 text-12 text-gray-500 line-through">
                          {formatCurrency(price ?? 0, currency ?? 'USD')}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(discountedPrice ?? 0, currency ?? 'USD')}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{formatCurrency(price ?? 0, currency ?? 'USD')}</span>
                      </>
                    )}
                  </td>
                  <td className="p-4 text-right lg:table-cell">
                    {formatCurrency((discountedPrice || price || 0) * (quantity ?? 1), currency ?? 'USD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end border-neutral-400 pb-7 pt-6">
        <div className="flex w-full flex-col gap-2 md:px-4 lg:w-[420px] lg:pl-0">
          <div className="flex items-center justify-between text-14 text-gray-600">
            <span>{translate('common.subtotal')}</span>
            <span>{formatCurrency(quote.subtotal, quote.currency)}</span>
          </div>

          {quote.shippingCosts && quote.shippingCosts > 0 && (
            <div className="flex items-center justify-between text-14 text-gray-600">
              <span>{translate('common.shipping')}</span>
              <span>{formatCurrency(quote.shippingCosts, quote.currency)}</span>
            </div>
          )}

          {quote.taxCosts && quote.taxCosts > 0 && (
            <div className="flex items-center justify-between text-14 text-gray-600">
              <span>{translate('common.tax')}</span>
              <span>{formatCurrency(quote.taxCosts, quote.currency)}</span>
            </div>
          )}

          {quote.discount && quote.discount > 0 && (
            <div className="flex items-center justify-between text-14 text-gray-600">
              <span>{translate('common.discount')}</span>
              <span>-{formatCurrency(quote.discount, quote.currency)}</span>
            </div>
          )}

          <div className="flex items-center justify-between font-medium text-gray-700">
            <span>{translate('common.total')}:</span>
            <span>{formatCurrency(quote.total, quote.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailsPage;
