import { ProjectSettings } from '@Types/ProjectSettings';
import { BaseApi } from './BaseApi';

export class ProjectApi extends BaseApi {
  getProjectSettings: () => Promise<ProjectSettings> = async () => {
    const project = await this.getProject();

    return Promise.resolve({
      name: project.name,
      countries: project.countries,
      currencies: project.currencies,
      languages: project.languages,
    });
  };
}
