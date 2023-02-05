export function buildRoutePath(path) {
  const routeRegExp = /:([a-zA-Z]+)/g;
  const pathWithParams = path.replaceAll(routeRegExp, '(?<$1>[a-z0-9\-_]+)');

  const pathRegExp = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`, 'i');

  return pathRegExp;
}