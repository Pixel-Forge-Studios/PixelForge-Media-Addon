function findMedia() {
  const videos = document.querySelectorAll('video');
  const audios = document.querySelectorAll('audio');
  
  function getMediaInfo(element, type) {
    let title = '未知' + type;
    const parentElement = element.closest('div, article');
    if (parentElement) {
      const titleElement = parentElement.querySelector('h1, h2, h3, .title');
      if (titleElement) {
        title = titleElement.textContent.trim();
      }
    }
    return {
      src: element.src || element.currentSrc,
      type: element.type || (type === '视频' ? 'video/mp4' : 'audio/mpeg'),
      title: title,
      mediaType: type
    };
  }

  const videoList = Array.from(videos).map(video => getMediaInfo(video, '视频'));
  const audioList = Array.from(audios).map(audio => getMediaInfo(audio, '音频'));

  return [...videoList, ...audioList];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getMedia') {
    sendResponse(findMedia());
  }
});
