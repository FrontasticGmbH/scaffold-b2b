import { Store as CommercetoolsStore } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/Store';
import { Channel } from '@Types/store/Channel';

export default class StoreMapper {
  static mapCommercetoolsStoreToStore(store: CommercetoolsStore, locale: string): Store {
    return {
      name: store.name?.[locale],
      storeId: store.id,
      key: store.key,
      distributionChannels: store.distributionChannels.map((commercetoolsChannel) => {
        const channel: Channel = {
          channelId: commercetoolsChannel.id,
        };
        return channel;
      }),
      supplyChannels: store.supplyChannels.map((commercetoolsChannel) => {
        const channel: Channel = {
          channelId: commercetoolsChannel.id,
        };
        return channel;
      }),
      productSelectionIds: store.productSelections
        // We are only mapping active product selections
        .filter((commercetoolsProductSelectionSetting) => commercetoolsProductSelectionSetting.active)
        .map((commercetoolsProductSelectionSetting) => {
          return commercetoolsProductSelectionSetting.productSelection.id;
        }),
    };
  }
}
