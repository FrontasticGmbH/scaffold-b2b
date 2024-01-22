import { Store } from '@Types/store/Store';
import { StoreMapper } from '../mappers/StoreMapper';
import { BaseApi } from '@Commerce-commercetools/apis/BaseApi';

export class StoreApi extends BaseApi {
  getDefaultKey: () => string = () => {
    return this.clientSettings.defaultStoreKey;
  };

  get: (key: string) => Promise<Store> = async (key: string): Promise<Store> => {
    const locale = await this.getCommercetoolsLocal();

    try {
      return this.requestBuilder()
        .stores()
        .withKey({ key })
        .get()
        .execute()
        .then((response) => {
          return StoreMapper.mapCommercetoolsStoreToStore(response.body, locale.language);
        });
    } catch (e) {
      console.log(e);

      throw '';
    }
  };

  query: (where: string, expand?: string | string[]) => Promise<any> = async (
    where: string,
    expand?: string | string[],
  ): Promise<Store[]> => {
    const locale = await this.getCommercetoolsLocal();

    try {
      return this.requestBuilder()
        .stores()
        .get({
          queryArgs: {
            where,
            expand,
          },
        })
        .execute()
        .then((response) => {
          return response.body.results.map((store) => StoreMapper.mapCommercetoolsStoreToStore(store, locale.language));
        });
    } catch (e) {
      console.log(e);

      throw '';
    }
  };
}
