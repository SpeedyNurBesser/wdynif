browser.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'setDuration') {
      let duration = message.duration;
      let tabId = sender.tab.id;
      let url = sender.tab.url;
      let reason = message.reason;

      addToCSV(url, reason, duration, tabId);


      if ((duration && tabId) && !(duration == 'idefinite')) {
        console.log("Opened tab" + tabId + " for " + duration + " seconds.")
        browser.tabs.sendMessage(tabId, {action: "hideOverlay"})
        addTabId(tabId)

        setTimeout(function() {
          console.log("Closed tab" + tabId + " again after " + duration + " seconds.")
          browser.tabs.sendMessage(tabId, {action: "showOverlay"})
          removeTabId(tabId)
        }, (duration*1000)); // ms
      }
    } else if (message.action === 'getTabId') {
        const tabId = sender.tab.id;
        browser.tabs.sendMessage(sender.tab.id, { action: 'setTabId', tabId: tabId });
    } else if (message.action === 'closeTab') {
        browser.tabs.remove(sender.tab.id)
        let tabId = sender.tab.id;
        let url = sender.tab.url;
        let reason = "no reason"
        let timeEstimate = "closed"
        addToCSV(url, reason, timeEstimate, tabId)
    }
  });

function addTabId(tabId) { // adds specific tabId to tabIds array
    browser.storage.local.get('tabIds').then(result => {
        let tabIds = result.tabIds || [];
        tabIds.push(tabId)
        browser.storage.local.set({ tabIds })
    })
}

function removeTabId(tabId) { // removes specific tabId from tabIds array
    browser.storage.local.get('tabIds').then(result => {
        let tabIds = result.tabIds || [];
        const index = tabIds.indexOf(tabId);
        if (index > -1) { // only splice array when item is found
            tabIds.splice(index, 1); // 2nd parameter means remove one item only
        }
        browser.storage.local.set({ tabIds})
    })
}

function addToCSV(url, reason, timeEstimate, tabId) {
    let currentdate = new Date(); 
    let datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


    browser.storage.local.get('data').then(result => {
        let data = result.data || [];
        let dataSet = {timestamp: datetime, url: url, reason: reason, duration: timeEstimate, tab: tabId}
        data.push(dataSet)
        browser.storage.local.set({ data })
    })
}