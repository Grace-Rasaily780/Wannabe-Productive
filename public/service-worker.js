const defaultBlocks = ['instagram.com', 'facebook.com']; 

let rules = defaultBlocks.map(site => ({
    id: Math.floor(Math.random() * 100),
    priority: 1,
    action: {type: "block"},
    condition: {
        urlFilter: site,
        resourceTypes: ["main_frame"]
    }  
}))

// console.log(rules)
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get().then(value => {
        // console.log(value)
        if(value.blockedSites) {
            if(value.blockedSites.length > 2){
                chrome.storage.sync.set({
                    blockedSites: value.blockedSites,
                });
            }   
        }
    })
    chrome.storage.sync.set({
        blockedSites: defaultBlocks,
        isExtOn: false
    });

  // Add initial blocking rule
    chrome.storage.sync.get().then(async (value) => {
        // console.log(value)
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        const oldRuleIds = oldRules.map(rule => rule.id);
        if(value.isExtOn == true){
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: oldRuleIds,
                addRules: rules
            });
        }
    });
    
});

chrome.storage.onChanged.addListener(async (changes) => {
    // console.log(changes);
    if (changes.blockedSites) {
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        const oldRuleIds = oldRules.map(rule => rule.id);

        const blockedSites = changes.blockedSites.newValue;
        let sites = blockedSites.map(site => ({
            id: Math.floor(Math.random() * 100),
            priority: 1,
            action: {type: "block"},
            condition: {
                urlFilter: site,
                resourceTypes: ["main_frame"]
            }  
        }))

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: oldRuleIds,
            addRules: sites
        })
    } else if(changes.isExtOn) {
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        const oldRuleIds = oldRules.map(rule => rule.id);
        // console.log(oldRules, oldRuleIds);

        if(changes.isExtOn.newValue == false){
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: oldRuleIds,
                addRules: []
            })
        } else if(changes.isExtOn.newValue == true) {
            chrome.storage.sync.get().then(async (value) => {
                // console.log(value)
                const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
                const oldRuleIds = oldRules.map(rule => rule.id);

                let sites = value.blockedSites.map(site => ({
                    id: Math.floor(Math.random() * 100),
                    priority: 1,
                    action: {type: "block"},
                    condition: {
                        urlFilter: site,
                        resourceTypes: ["main_frame"]
                    }  
                }))

                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: oldRuleIds,
                    addRules: sites
                });
            });
            // chrome.declarativeNetRequest.updateDynamicRules({
            //     removeRuleIds: oldRuleIds,
            //     addRules: rules
            // })
        }
    }
});

// Utils 
// function constructUrlFilter(sites) {
//   return sites.map(s => `||${s}`).join(','); 
// }

// Allow other scripts to get blocked sites
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.getBlockedSites) {
//     chrome.storage.sync.get('blockedSites', result => {
//       sendResponse(result.blockedSites);
//     });
//     return true; // async
//   }
// });