class SwitchBot {

//  properties/constructor/destructor
constructor() {
  const propService = PropertiesService.getScriptProperties();
  this.ClientToken  = propService.getProperty('clientID'),
  this.ClientSecret = propService.getProperty('clientSecret'),
  this.requestID    = 0;
}

//------------------------------------------------------------------------------------
//  method
//------------------------------------------------------------------------------------
//  get access token
getAccessTokenHeader() {
  const nonce = "nonce";
  const t     = Date.now().toString();
  const data  = this.ClientToken + t + nonce;
  const sign  = Utilities.base64Encode(
                  Utilities.computeHmacSignature(
                    Utilities.MacAlgorithm.HMAC_SHA_256,
                    data,
                    this.ClientSecret
                  )
                );
  return  {
      headers: {
          "Authorization": this.ClientToken,
          "sign": sign,
          "nonce": nonce,
          "t": t,
      }
  };
}

//  call Restful API : any
callApiWithPath(type,path,payload,extHeaders) {
  //  check latest access token
  const tokenHeader = this.getAccessTokenHeader();
  var options = {
    "method" : type,
    "headers" : tokenHeader.headers,
    "muteHttpExceptions" : true
  };
  if (payload != null) {
    options['payload'] = JSON.stringify(payload);
  }
  if (extHeaders != null) {
    for(var i in extHeaders) {
      var body = extHeaders[i];
      options['headers'][i] = body;
    }
  }

  try {
    const result  = UrlFetchApp.fetch(path, options);
    if (result) {
      const contextText = result.getContentText();
      const contextCode = result.getResponseCode();
      if (contextText.length > 1 && contextCode == 200) {
        return  JSON.parse(contextText);
      }
    }
    return  {
      error:    "Error",
      code:     result.getResponseCode(),
      headers:  result.getAllHeaders(),
      text:     result.getContentText(),
      result: result
    };
  }
  catch(e) {
    console.log("API Fetch Error : "+e);
  }
  return  null;
}

getAllDevices() {
  return  this.callApiWithPath("GET","https://api.switch-bot.com/v1.1/devices/",null,null);
}

getAllDevicesWithStatus() {
  var deviceList  = this.getAllDevices();
  if (deviceList['body']) {
    if (deviceList['body']['deviceList']) {
      for(var i in deviceList['body']['deviceList']) {
        var deviceItem  = deviceList['body']['deviceList'][i];
        const itemDetail  = this.callApiWithPath(
                              "GET",
                              "https://api.switch-bot.com/v1.1/devices/"
                              + deviceItem['deviceId']
                              + "/status",
                              null,
                              null
                            );
        deviceList['body']['deviceList'][i]['status'] = itemDetail;
      }
      var itemList  = deviceList['body']['deviceList'];
          itemList  = itemList.sort(
                        function(a,b) {
                          const numA  = a['deviceName'];
                          const numB  = b['deviceName'];
                          const result  = (numB == numA) ? 0 : ((numB < numA) ? 1 : -1);
                          return  result;
                        }
                      );
      return  itemList;
    }
  }
  return  {
    "error":  "failed to get device list",
    "result": deviceList
  };
}
//  End of class
};

