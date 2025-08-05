import { ProjectSettings } from '@Types/ProjectSettings';
import { Store } from '@Types/store/Store';
import BaseApi from './BaseApi';
import extractRegionFromCommercetoolsHostUrl from '@Commerce-commercetools/utils/extractRegionFromCommercetoolsHostUrl';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import StoreMapper from '@Commerce-commercetools/mappers/StoreMapper';

export default class ProjectApi extends BaseApi {
  async getProjectSettings(): Promise<ProjectSettings> {
    const commercetoolsProject = await this.getCommercetoolsProject();
    const region = extractRegionFromCommercetoolsHostUrl(this.clientSettings.hostUrl);

    return Promise.resolve({
      name: commercetoolsProject.name,
      projectKey: commercetoolsProject.key,
      countries: commercetoolsProject.countries,
      currencies: commercetoolsProject.currencies,
      languages: commercetoolsProject.languages,
      region,
    });
  }

  async queryStores(where: string, expand?: string | string[]): Promise<Store[]> {
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

  async getStoreById(id: string): Promise<Store> {
    const locale = await this.getCommercetoolsLocal();

    const commercetoolsStore = await this.getCommercetoolsStoreById(id);

    return StoreMapper.mapCommercetoolsStoreToStore(commercetoolsStore, locale.language);
  }

  async getStoreByKey(key: string): Promise<Store> {
    const locale = await this.getCommercetoolsLocal();

    const commercetoolsStore = await this.getCommercetoolsStoreByKey(key);

    return StoreMapper.mapCommercetoolsStoreToStore(commercetoolsStore, locale.language);
  }
}
