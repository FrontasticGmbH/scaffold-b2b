import { desktop } from '@/constants/screensizes';
import useMediaQuery from '@/hooks/useMediaQuery';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import {
  ChatBubbleLeftRightIcon as QuotesIcon,
  ShoppingCartIcon as OrdersIcon,
  BuildingOfficeIcon as CompanyAdminIcon,
  ClipboardDocumentListIcon as PurchaseListsIcon,
  Cog6ToothIcon as SettingsIcon,
  MapPinIcon as AddressesIcon,
  CheckIcon as ApprovalIcon,
  ArrowsRightLeftIcon as FlowIcon,
} from '@heroicons/react/24/outline';
import { DashboardLinks } from '../../constants';

const useItems = () => {
  const { translate } = useTranslation();

  const [isLargerThanDesktop] = useMediaQuery(desktop);

  const items = {
    dashboard: {
      icon: <></>,
      name: translate('common.dashboard'),
      summary: '',
      href: DashboardLinks.dashboard,
      disabled: false,
      disabledMessage: '',
      order: 1,
    },
    orders: {
      icon: <OrdersIcon />,
      name: translate('common.orders'),
      summary: translate('dashboard.orders.summary'),
      href: DashboardLinks.orders,
      disabled: false,
      disabledMessage: '',
      order: 2,
    },
    quotes: {
      icon: <QuotesIcon />,
      name: translate('common.quotes'),
      summary: translate('dashboard.quotes.summary'),
      href: DashboardLinks.quotes,
      disabled: false,
      disabledMessage: '',
      order: 3,
    },
    companyAdmin: {
      icon: <CompanyAdminIcon />,
      name: translate('common.company.admin'),
      summary: translate('dashboard.company.admin.summary'),
      href: DashboardLinks.companyAdmin,
      disabled: !isLargerThanDesktop,
      disabledMessage: translate('dashboard.company.admin.disabled.on.small.screens'),
      order: isLargerThanDesktop ? 4 : 999,
    },
    purchaseLists: {
      icon: <PurchaseListsIcon />,
      name: translate('common.purchase.lists'),
      summary: translate('dashboard.purchase.lists.summary'),
      href: DashboardLinks.shoppingLists,
      disabled: false,
      disabledMessage: '',
      order: 5,
    },
    approvalRules: {
      icon: <ApprovalIcon />,
      name: translate('common.approval.rules'),
      summary: translate('dashboard.approval.rules.summary'),
      href: DashboardLinks.approvalRules,
      disabled: !isLargerThanDesktop,
      disabledMessage: translate('dashboard.approval.rules.disabled.on.small.screen'),
      order: isLargerThanDesktop ? 6 : 999,
    },
    approvalFlows: {
      icon: <FlowIcon />,
      name: translate('common.approval.flows'),
      summary: translate('dashboard.approval.flows.summary'),
      href: DashboardLinks.approvalFlows,
      disabled: false,
      disabledMessage: '',
      order: 7,
    },
    settings: {
      icon: <SettingsIcon />,
      name: translate('common.settings'),
      summary: translate('dashboard.settings.summary'),
      href: DashboardLinks.settings,
      disabled: false,
      disabledMessage: '',
      order: 8,
    },
    addresses: {
      icon: <AddressesIcon />,
      name: translate('common.addresses'),
      summary: translate('dashboard.addresses.summary'),
      href: DashboardLinks.addresses,
      disabled: false,
      disabledMessage: '',
      order: 9,
    },
  };

  const sidebarItems = [
    items.dashboard,
    items.orders,
    items.quotes,
    items.companyAdmin,
    items.purchaseLists,
    items.approvalRules,
    items.approvalFlows,
    items.settings,
    items.addresses,
  ];

  const cardItems = [
    items.orders,
    items.quotes,
    items.companyAdmin,
    items.purchaseLists,
    items.approvalRules,
    items.approvalFlows,
    items.settings,
    items.addresses,
  ];

  return { sidebarItems, cardItems };
};

export default useItems;
