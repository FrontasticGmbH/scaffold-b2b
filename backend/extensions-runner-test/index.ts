import { ExtensionRegistry } from '@frontastic/extension-types';
import * as teamActions from './actions';
import SportsAPI from './api-source';

const extensionRegistry: ExtensionRegistry = {
  'data-sources': {
    'integration/test': async () => {
      const contentApi = new SportsAPI();
      return {
        dataSourcePayload: await contentApi.getTeams(),
      };
    },
  },
  actions: {
    teams: teamActions,
  },
};
export default extensionRegistry;
