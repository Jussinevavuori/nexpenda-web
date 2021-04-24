import { ValidIntervalLengthType } from "../models/interval.model";

export class RouteData {
  /**
   * Internal name for the route.
   */
  readonly name: string;

  /**
   * Path for the route.
   */
  readonly path: string;

  /**
   * User-readable displayed title for the route.
   */
  readonly title: string;

  /**
   * A forced interval within this route if any.
   */
  readonly forcedIntervalLength?: ValidIntervalLengthType;

  /**
   * List of disabled interval lengths within this route.
   */
  readonly disabledIntervalLengths: ValidIntervalLengthType[];

  constructor(options: {
    name: RouteData["name"];
    path: RouteData["path"];
    title: RouteData["title"];
    disabledIntervalLengths?: ValidIntervalLengthType[];
    forcedIntervalLength?: ValidIntervalLengthType;
  }) {
    this.name = options.name;
    this.path = options.path;
    this.title = options.title;
    this.forcedIntervalLength = options.forcedIntervalLength;
    this.disabledIntervalLengths = options.disabledIntervalLengths ?? [];
  }

  /**
   * Check if an interval length is enabled for this route.
   *
   * @param intervalLength Interval length to check.
   */
  isIntervalLengthEnabled(intervalLength: ValidIntervalLengthType) {
    if (this.forcedIntervalLength) {
      return intervalLength === this.forcedIntervalLength;
    } else {
      return !this.disabledIntervalLengths.includes(intervalLength);
    }
  }

  /**
   * Check if an interval length is disabled for this route.
   *
   * @param intervalLength Interval length to check.
   */
  isIntervalLengthDisabled(intervalLength: ValidIntervalLengthType) {
    return !this.isIntervalLengthEnabled(intervalLength);
  }

  /**
   * Check if this route matches the given pathname
   *
   * @param pathname Pathname to check
   */
  matchesPathname(pathname: string) {
    const routeRegexp = new RegExp(this.path + "$");
    return !!pathname.match(routeRegexp);
  }
}
