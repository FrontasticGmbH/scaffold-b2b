import { ProjectSettings } from '@Types/ProjectSettings';
import BaseApi from './BaseApi';

export default class ProjectApi extends BaseApi {
  async getProjectSettings(): Promise<ProjectSettings> {
    const project = await this.getCommercetoolsProject();

    return Promise.resolve({
      name: project.name,
      projectKey: project.key,
      countries: project.countries,
      currencies: project.currencies,
      languages: project.languages,
    });
  }
}
