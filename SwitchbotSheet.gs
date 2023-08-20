//==============================================================================================
//  Show all value
//==============================================================================================
function  SwitchBot_UpdateStatus() {
  const  oSwitchBot  = new SwitchBot();
  const  resultVal   = oSwitchBot.getAllDevicesWithStatus();

  var allData = [];
  for(var i in resultVal) {
    var perLine = [];
    var itemLine = resultVal[i];
    perLine = [
      i,
      itemLine['deviceId'],
      itemLine['deviceName'],
      itemLine['deviceType'],
      itemLine['enableCloudService'],
      itemLine['status']['statusCode'] + " : " + itemLine['status']['message'],
      "",
      "",
      "",
      JSON.stringify(itemLine)
    ];
    switch(itemLine['deviceType']) {
    //  防水温湿度計
    case  "WoIOSensor":
      perLine[6]  = itemLine['status']['body']['battery'],
      perLine[7]  = itemLine['status']['body']['temperature'],
      perLine[8]  = itemLine['status']['body']['humidity']
      break;
    }
    allData.push(perLine);
  }

  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty('sheetID')
  );

  //  update 'devices' tab
  const ssDevice = ss.getSheetByName('devices');
  //  set value
  ssDevice.getRange(2,1,allData.length, allData[0].length).setValues(allData);

  //  update 'history' tab
  const ssStatus  = ss.getSheetByName('status');
  const ssHistory = ss.getSheetByName('history');
    ssStatus.getRange("B2")
      .setValue(new Date())
      .setNumberFormat('yyyy/mm/dd hh:mm:ss');

  ssHistory.insertRowBefore(2);
    //  日時
    ssHistory.getRange("A2").setValue(ssStatus.getRange("B2").getValue());
    //  ガレージ
    ssHistory.getRange("B2").setValue(ssStatus.getRange("C3").getValue());
    ssHistory.getRange("C2").setValue(ssStatus.getRange("D3").getValue());
    //  ベランダ
    ssHistory.getRange("D2").setValue(ssStatus.getRange("C4").getValue());
    ssHistory.getRange("E2").setValue(ssStatus.getRange("D4").getValue());
    //  リビング
    ssHistory.getRange("F2").setValue(ssStatus.getRange("C5").getValue());
    ssHistory.getRange("G2").setValue(ssStatus.getRange("D5").getValue());

  SpreadsheetApp.flush();
}
