function displayMedia(mediaItems) {
  const mediaList = document.getElementById('mediaList');
  mediaList.innerHTML = '';
  if (mediaItems.length === 0) {
    mediaList.innerHTML = '<li>未找到媒体</li>';
    return;
  }
  mediaItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'media-item';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'media-title';
    titleDiv.textContent = item.title;
    li.appendChild(titleDiv);
    
    const typeDiv = document.createElement('div');
    typeDiv.className = 'media-type';
    typeDiv.textContent = item.mediaType;
    li.appendChild(typeDiv);
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'media-actions';
    
    const viewBtn = document.createElement('button');
    viewBtn.textContent = '查看';
    viewBtn.onclick = () => {
      chrome.tabs.create({url: item.src});
    };
    actionsDiv.appendChild(viewBtn);
    
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '下载';
    downloadBtn.onclick = () => {
      const extension = item.mediaType === '视频' ? '.mp4' : '.mp3';
      const filename = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${extension}`;
      chrome.downloads.download({url: item.src, filename: filename});
    };
    actionsDiv.appendChild(downloadBtn);
    
    li.appendChild(actionsDiv);
    mediaList.appendChild(li);
  });
}

function refreshMedia() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getMedia'}, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        displayMedia([]);
      } else {
        displayMedia(response);
      }
    });
  });
}

document.getElementById('refreshBtn').addEventListener('click', refreshMedia);

refreshMedia();
