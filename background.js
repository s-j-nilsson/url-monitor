let urls = [];
let pollInterval = 5; // Default polling interval in minutes

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkURLs') {
    checkURLs();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateURLs") {
    urls = request.urls;
    pollInterval = request.interval;
    setupAlarm();
  }
});

function setupAlarm() {
  chrome.alarms.clear('checkURLs', () => {
    chrome.alarms.create('checkURLs', { periodInMinutes: pollInterval });
    checkURLs();
  });
}

function checkURLs() {
  urls.forEach((url, index) => {
    fetch(url, { mode: 'no-cors' })
        .then(response => {
          // In no-cors mode, response.status will be 0, so we'll assume the URL is up if fetch succeeds
          if (response.type === 'opaque') {
            updateURLStatus(index, 'up'); // Opaque response means success but no details
          } else {
            updateURLStatus(index, 'down');
          }
        })
        .catch(() => {
          updateURLStatus(index, 'down'); // If fetch fails, consider the URL "down"
        });
  });
}

function updateURLStatus(index, status) {
  chrome.storage.local.get(['urlStatuses'], (result) => {
    let urlStatuses = result.urlStatuses || [];
    urlStatuses[index] = status;
    chrome.storage.local.set({ urlStatuses });
    chrome.runtime.sendMessage({ action: 'statusUpdate', urlStatuses });
  });
}
