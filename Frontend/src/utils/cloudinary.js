export function toCloudinaryDownloadUrl(url, filename) {
  if (!url?.includes('/upload/')) return url;
  const [head, tail] = url.split('/upload/');
  const attach = 'upload/fl_attachment' + (filename ? ':' + encodeURIComponent(filename) : '') + '/';
  return `${head}/${attach}${tail}`;
}
