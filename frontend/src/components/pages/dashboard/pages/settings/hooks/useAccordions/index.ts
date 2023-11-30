import { useCallback, useState } from 'react';

const useAccordions = () => {
  const [accordionExpanded, setAccordionExpanded] = useState({
    newsletterPref: false,
    passwordChange: false,
    deleteAccount: false,
  });

  const toggleAccordionExpansion = useCallback(
    (key: keyof typeof accordionExpanded, expand: boolean) => {
      setAccordionExpanded({ ...accordionExpanded, [key]: expand });
    },
    [accordionExpanded],
  );

  const expandAccordion = useCallback(
    (key: keyof typeof accordionExpanded) => {
      toggleAccordionExpansion(key, true);
    },
    [toggleAccordionExpansion],
  );

  const collapseAccordion = useCallback(
    (key: keyof typeof accordionExpanded) => {
      toggleAccordionExpansion(key, false);
    },
    [toggleAccordionExpansion],
  );

  return { accordionExpanded, expandAccordion, collapseAccordion };
};

export default useAccordions;
