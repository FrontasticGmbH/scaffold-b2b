import { ProjectSettings } from '@Types/ProjectSettings';

import BaseApi from './BaseApi';
import extractRegionFromCommercetoolsHostUrl from '@Commerce-commercetools/utils/extractRegionFromCommercetoolsHostUrl';

export default class ProjectApi extends BaseApi {
  async getProjectSettings(): Promise<ProjectSettings> {
    const project = await this.getCommercetoolsProject();
    const region = extractRegionFromCommercetoolsHostUrl(this.clientSettings.hostUrl);

    return Promise.resolve({
      name: project.name,
      projectKey: project.key,
      countries: project.countries,
      currencies: project.currencies,
      languages: project.languages,
      region,
    });
  }
}
