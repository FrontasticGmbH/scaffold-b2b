import { ProjectSettings } from '@shared/types/ProjectSettings';
import { Event, SDK, ServerOptions } from '@commercetools/frontend-sdk';
import { GetProjectSettingsAction } from '../../types/actions/ProjectActions';
import { ComposableCommerceEventsB2B } from '../../types/events/ComposableCommerceEventsB2B';

export type ProjectActions = {
  getSettings: GetProjectSettingsAction;
};

export const getProjectActions = (sdk: SDK<ComposableCommerceEventsB2B>): ProjectActions => {
  return {
    getSettings: async (
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ProjectSettings>({
        actionName: 'project/getProjectSettings',
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (response.isError === false) {
        sdk.trigger(
          new Event({
            eventName: 'projectSettingsFetched',
            data: {
              projectSettings: response.data,
            },
          }),
        );
      }
      return response;
    },
  };
};
