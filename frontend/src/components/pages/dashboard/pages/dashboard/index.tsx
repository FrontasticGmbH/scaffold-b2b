import { useState } from 'react';
import Link from '@/components/atoms/link';
import Card from '@/components/molecules/card';
import InfoTooltip from '@/components/atoms/info-tooltip';
import { QuestionMarkCircleIcon as InfoIcon } from '@heroicons/react/24/outline';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useItems from '../../hooks/useItems';

const DashboardPage = () => {
  const { cardItems } = useItems();

  const [showDisabledMessage, setShowDisabledMessage] = useState<Record<string, boolean>>({});

  const { ref } = useOnClickOutside(() => setShowDisabledMessage({}));

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" ref={ref}>
      {cardItems.map(({ icon, name, summary, href, disabled, disabledMessage, order }) => (
        <div key={href} className="relative" style={{ order }} onClick={() => setShowDisabledMessage({ [href]: true })}>
          <Link
            href={href}
            className="block w-full"
            style={{ opacity: disabled ? 0.5 : 1 }}
            underlineOnHover={false}
            {...(disabled ? { onClick: (e) => e.preventDefault() } : {})}
          >
            <Card icon={icon} title={name} summary={summary} />
          </Link>
          {disabled && (
            <InfoTooltip
              isOpen={!!showDisabledMessage[href]}
              setIsOpen={(val) => setShowDisabledMessage({ ...showDisabledMessage, [href]: val })}
              icon={InfoIcon}
              className="absolute right-3 top-3"
              content={disabledMessage}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
