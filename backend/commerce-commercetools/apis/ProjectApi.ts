import { ProjectSettings } from '@Types/ProjectSettings';
import BaseApi from './BaseApi';

export default class ProjectApi extends BaseApi {
  getProjectSettings: () => Promise<ProjectSettings> = async () => {
    const project = await this.getCommercetoolsProject();

    return Promise.resolve({
      name: project.name,
      countries: project.countries,
      currencies: project.currencies,
      languages: project.languages,
    });
  };
}
