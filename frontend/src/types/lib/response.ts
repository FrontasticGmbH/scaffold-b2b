export interface RedirectResponse {
  statusCode: number;
  /**
   * One of REASON_* constants
   */
  reason: string;
  /**
   * One of TARGET_TYPE_* constants
   */
  targetType: string;
  /**
   * The target url or path
   */
  target: string;
}
