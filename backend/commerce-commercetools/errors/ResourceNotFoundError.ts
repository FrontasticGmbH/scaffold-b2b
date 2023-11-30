import { ErrorProps, ExtensionError } from '../utils/Errors';

export class ResourceNotFoundError extends ExtensionError {
  constructor(options: ErrorProps) {
    super(options);
    this.code = 'resource_not_found_error';
  }
}
