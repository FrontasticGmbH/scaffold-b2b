import { DataSourceConfiguration, DataSourceContext, ExtensionRegistry } from '@frontastic/extension-types';
import ContentApi from './apis/ContentApi';
import * as ContentActions from './actionControllers/ContentController';
import { getLocale } from './utils/Request';

export default {
  'data-sources': {
    'frontastic/content': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      const contentApi = new ContentApi(context.frontasticContext, getLocale(context.request));

      return {
        dataSourcePayload: await contentApi.getContent(config.configuration.contentId),
      };
    },
  },
  actions: {
    content: ContentActions,
  },
} as ExtensionRegistry;
