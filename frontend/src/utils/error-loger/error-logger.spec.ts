import { Log } from '.';

describe('Error Logger', () => {
  beforeEach(() => {
    console.error = jest.fn();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-12-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should return a list of errors sorted by time when getErrors is called', () => {
    const firstError = new Error('an error');
    const secondError = new Error('another error');

    Log.error(firstError);
    Log.error(secondError);

    expect(Log.getErrors()[0].data).toEqual([firstError]);
    expect(Log.getErrors()[1].data).toEqual([secondError]);
    expect(Log.getErrors().length).toBe(2);
  });

  it('should add a warning text to a warning error', () => {
    console.error = jest.fn();
    const error = new Error('Something went wrong');
    Log.warn(error);
    expect(console.error).toHaveBeenCalledWith(`${Log.WARNING}:`, error);
  });

  it('should add a warning text when Log.warning is called', () => {
    const error = new Error('Something went wrong');
    Log.warning(error);
    expect(console.error).toHaveBeenCalledWith(`${Log.WARNING}:`, error);
  });

  it('should add an error text when Log.error is called', () => {
    const error = new Error('Something went wrong');
    Log.error(error);
    expect(console.error).toHaveBeenCalledWith(`${Log.ERROR}:`, error);
  });

  it('should indicate when errors have been logged', () => {
    Log.error(new Error('test error'));
    expect(Log.hasErrors()).toBe(true);
  });

  it('should call an error logger function when one is passed to it', () => {
    const errorLogger = jest.fn();
    const error = new Error('test error');
    Log.setErrorLogger(errorLogger);
    Log.error(error);

    expect(errorLogger).toHaveBeenCalledWith({
      data: [error],
      date: new Date('2024-12-01T00:00:00Z'),
      type: Log.ERROR,
    });
  });
});
