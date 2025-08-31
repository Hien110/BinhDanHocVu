export function convertYouTubeUrlToEmbed(url) {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");
  const listId = urlObj.searchParams.get("list");

  let embedUrl = `https://www.youtube.com/embed/${videoId}`;
  if (listId) {
    embedUrl += `?list=${listId}`;
  }
  return embedUrl;
}
