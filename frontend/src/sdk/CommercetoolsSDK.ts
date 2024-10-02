import { SDK } from '@commercetools/frontend-sdk';
import { getLocalizationInfo } from '@/project.config';
import { ComposableCommerceB2B, ComposableCommerceEventsB2B } from './composable-commerce-b2b';
import { CustomEvents } from './CustomEvents';

// Add other integration's custom events to the SDK's generic type here,
// by extending ComposableCommerceEvents with their type using an intersection.
// For example, <ComposableCommerceEvents & OtherEvents>.
// You may also wish to add your own custom events.
class CommercetoolsSDK extends SDK<ComposableCommerceEventsB2B & CustomEvents> {
  composableCommerce!: ComposableCommerceB2B;
  // Add any other integrations here.

  constructor() {
    super();
    this.composableCommerce = new ComposableCommerceB2B(this);
    // Initialize your other integrations here.

    this.on('errorCaught', (event) => {
      // Globally handle any errors caught by the SDK and integrations. For
      // example, log error, fire notification, etc.
      console.log('SDK error: ', event.data);
    });

    // Set up any other custom global event handlers here.
    // Ensure types are created and added to the SDK generic type
    // if specific to your project.
  }

  // A simplified, reusable method for configuring the SDK, as for
  // most cases only the locale and currency require input from runtime, or
  // may change on user input.
  defaultConfigure(localeString: string) {
    const { locale, currency } = getLocalizationInfo(localeString);

    this.configure({
      locale,
      currency,
      extensionVersion: process.env.NEXT_PUBLIC_EXT_BUILD_ID ?? 'dev',
      endpoint: process.env.NEXT_PUBLIC_FRONTASTIC_HOST as string,
    });
  }
}

// Create a single instance of the sdk.
const sdk = new CommercetoolsSDK();

// Export only the instance to serve as a singleton throughout
// the project.
export { sdk };
