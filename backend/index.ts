// START: List of used extensions

/* POLYFILLS */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import commercetoolsExtension from '@Commerce-commercetools';
import adyenExtension from '@Payment-adyen';
import contentfulExtensions from '@Content-contentful';

// Integration tests
import appHealthExtension from './extensions-runner-test';

const extensionsToMerge = [
  commercetoolsExtension,
  adyenExtension,
  contentfulExtensions,
  appHealthExtension,
] as Array<ExtensionRegistry>;
// END: List of used extensions

import {
  ExtensionRegistry,
  ActionRegistry,
  DynamicPageHandler,
  DynamicPageRedirectResult,
  DynamicPageSuccessResult,
} from '@frontastic/extension-types';

const mergeActions = (extensions: Array<ExtensionRegistry>): ActionRegistry => {
  const actionNamespaces = {};
  for (const extension of extensions) {
    for (const actionNamespace in extension['actions'] || {}) {
      if (!actionNamespaces[actionNamespace]) {
        actionNamespaces[actionNamespace] = {};
      }
      actionNamespaces[actionNamespace] = Object.assign(
        {},
        actionNamespaces[actionNamespace],
        extension['actions'][actionNamespace],
      );
    }
  }
  return actionNamespaces;
};

type PossibleDynamicPageResults = DynamicPageSuccessResult | DynamicPageRedirectResult | null;
type DynamicPageHandlerResponse = PossibleDynamicPageResults | Promise<PossibleDynamicPageResults>;

const mergeDynamicPageHandlers = (extensions: Array<ExtensionRegistry>): DynamicPageHandler => {
  return async (request, dynamicPageContext) => {
    for (const extension of extensions) {
      if (extension['dynamic-page-handler']) {
        const result: DynamicPageHandlerResponse = await extension['dynamic-page-handler'](request, dynamicPageContext);

        if (result !== null) {
          return result;
        }
      }
    }

    return null;
  };
};

export default {
  'dynamic-page-handler': mergeDynamicPageHandlers(extensionsToMerge),
  'data-sources': extensionsToMerge.map((extension) => extension['data-sources'] || {}).reduce(Object.assign, {}),
  actions: mergeActions(extensionsToMerge),
} as ExtensionRegistry;
