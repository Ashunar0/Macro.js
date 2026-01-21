export function generateAppsscript(): string {
  const config = {
    timeZone: 'Asia/Tokyo',
    dependencies: {},
    exceptionLogging: 'STACKDRIVER',
    runtimeVersion: 'V8',
  };
  return JSON.stringify(config, null, 2) + '\n';
}
