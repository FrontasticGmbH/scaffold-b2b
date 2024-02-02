import { ExtensionError, ExtensionErrorProperties } from './Errors';

export class BusinessUnitDuplicatedError extends ExtensionError {
  static BUSINESS_UNIT_DUPLICATED_ERROR_NAME: 'business_unit_duplicated_error';

  constructor(options: ExtensionErrorProperties) {
    super(options);
    this.errorName = BusinessUnitDuplicatedError.BUSINESS_UNIT_DUPLICATED_ERROR_NAME;
  }
}
