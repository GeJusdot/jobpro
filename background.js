//background.js
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "ILoveYou");
  port.onMessage.addListener(function(msg) {
    for(i=0;i<msg.urls.length;i++){
      url = msg.urls[i]
      var oReq = new XMLHttpRequest();  
      oReq.onreadystatechange = function(data) {
        if (oReq.readyState == 4) {
          if (oReq.status == 200) {
            port.postMessage({result:oReq.responseText});
          } else {
            //alert(5)
          }
        }
      }
     oReq.open("get", url, false);
     oReq.send();
   } 

  });
    
});

