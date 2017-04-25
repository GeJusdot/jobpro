(function () {

  var harWithContent = [];
  var maimailist = '';
  var authUrl = 'http://jp.tubban.cn/getauth/'
  //var authUrl = 'http://127.0.0.1:8888/getauth/'
  

  function canUseMai(uid){
    var canUseMai = true;
    var maiMaiId = 1657081;
    var expireTime = "2017-04-21 12:00:00";
    if(Date.parse(expireTime) <= new Date().getTime()){
      error = "expired!"
      return error;
    }
    if (uid != maiMaiId){
        error = "unknown identity!"
        return error;
    }
    return canUseMai || "cannot get maimai";
  }

var error=false;
function contectForAuth(entry){
    uid = getMaiMaiUid(entry)
    url = authUrl + uid;
    var port = chrome.runtime.connect({name: "goodbye"});
    port.postMessage({url: url});
    port.onMessage.addListener(function(msg) {
      //alert(msg.result)
      var userInfo = JSON.parse(msg.result);
      if(Date.parse(userInfo.maimai_expire) > new Date().getTime()
        && userInfo.can_use_maimai){
        getAllMaimaiFriend(entry.responseBody);
      }else{
        error="you donot have privilege, please call my owner!";
        initText(error);
      }      
    });
  }


  function getHarContent(HarLog) {
    if(HarLog.pages[0].title == 'https://maimai.cn/im/'){
        HarLog.entries.map(getMaiMaiList); 
    }  
  }

  function getMaiMaiList(entry,index){ 
    if(entry.request.url.search('/maimai/contact/') > 0 && 
      entry.response.status == 200 &&
      entry.response.content.mimeType=='application/json'
      ){
        entry.getContent(content => {
          entry.responseBody = content;
          harWithContent.push(entry);
          //contectForAuth(getMaiMaiUid(entry))
          contectForAuth(entry)
          //alert(error)
          //setTimeout(get(content),3000)
          /*
          if( error=== true){
            getAllMaimaiFriend(content);
          }else{
            initText(error);
          }  
          */ 
        }) 
    } 
  }

  function get(content){
    if(error === false){
      setTimeout(get(content),1000)
    }
    if( error=== true){
      getAllMaimaiFriend(content);
    }else{
      initText(error);
    }  
  }

  function getMaiMaiUid(entry){
    queryString = entry.request.queryString
    for (var i = 0; i < queryString.length; i++) {
      if(queryString[i].name == 'u'){
        return queryString[i].value;
      }
    }
    return 0;
  }

  function getAllMaimaiFriend(maimailist){
    maimailistObj = JSON.parse(maimailist);
    urllist = []
    for(one in maimailistObj.data){
      url = "https://maimai.cn/contact/detail/"+ String(maimailistObj.data[one].id) + "?jsononly=1"
      urllist.push(url)
      //break;
    }

    if(urllist.length == 0 ){
      document.getElementById('msg').innerHTML = "你没有好友或者你操作方式有误";
    }
   // alert(urllist.length)
    contentToBg(urllist);
  }

  function contentToBg(urllist){
    var port = chrome.runtime.connect({name: "ILoveYou"});
    port.postMessage({urls: urllist});
    port.onMessage.addListener(function(msg) {
      parseMaiResult(msg.result);  
    });
  }

  function parseMaiResult(result){
    result = JSON.parse(result)
    var li = document.createElement('li');
    li.innerHTML = result.data.card.name + ',' + result.data.uinfo.mobile;
    var rowContainer = document.querySelector('.network-entries');
    rowContainer.appendChild(li);   
  }
  
  function promisedGetContent(entry, index){
    return new Promise((resolve) => {
      if(!harWithContent[index]){
        entry.getContent(content => {
          entry.responseBody = content;
          entry.lowerCaseBody = content ? content.toLowerCase() : '';
          harWithContent[index] = entry;
          resolve();
        })

      }else{
        resolve();
      }

    })
  }

  function getNetwork() {
    //var res = contectForAuth(1657081);

    chrome.devtools.network.getHAR(getHarContent); 
    text =  "name,mobile";
    setTimeout(initText(text),5000);  
  }

  function initText(text){
    var ol = document.querySelector('.network-entries');
    if(ol.childNodes.length > 0){
      for (var i = ol.childNodes.length - 1; i >= 0; i--) {
        ol.removeChild(ol.childNodes[i]);
      }
    }
    var li = document.createElement('li');
    li.innerHTML = text;
    ol.appendChild(li);
  }

  function listenForUserInput() {
    var getNetworkButton = document.querySelector('.get-work');
    getNetworkButton.addEventListener('click', getNetwork);
  }

  function filterHar(){
    nfGlobal.filterHar(harWithContent);
  }
  window.addEventListener('load', listenForUserInput);

})();


