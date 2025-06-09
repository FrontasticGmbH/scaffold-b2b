import { Store } from '@Types/store/Store';
import StoreMapper from '../mappers/StoreMapper';
import BaseApi from '@Commerce-commercetools/apis/BaseApi';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

export default class StoreApi extends BaseApi {
  async get(key: string): Promise<Store> {
    const locale = await this.getCommercetoolsLocal();

    return this.requestBuilder()
      .stores()
      .withKey({ key })
      .get()
      .execute()
      .then((response) => {
        return StoreMapper.mapCommercetoolsStoreToStore(response.body, locale.language);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async query(where: string, expand?: string | string[]): Promise<Store[]> {
    const locale = await this.getCommercetoolsLocal();

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
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }
}
