$(document).ready(function(){

  const stateCodes = ["01", "02", "04", "05", "06", "08", "09", "10", "11", "12", "13", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "44", "45", "46", "47", "48", "49", "50", "51", "53", "54", "55", "56", "72"];

  getCensusInfo(stateCodes);

})

// Make call to server to get Census data
function getCensusInfo(stateArr){
  let results = [];
  stateArr.forEach((stateCode, index) => {
    let url = "/census/" + stateCode;
    $.when($.get(url, {async: false})
      .done((data, status) => {
        results.push(data[1]);
      })
      .fail(() => {
        console.log("Error");
      })
      .always(() => {
        console.log("Complete");
      }))
      .done(() => {
        if(results.length === stateArr.length){
          console.log("Finished! ", stateCode);
          const resultObj = populationCalc(results);
          postData(resultObj);
        }
      })
  })
}

// Calculate Total population and Max
function populationCalc(results) {
  let maxPopulation = 1;
  let highState = '';
  let totalPopulation = 0;
  let resultObj = {};

  results.forEach((item, index) => {
    totalPopulation += parseInt(item[0]);

    if(parseInt(item[0]) > maxPopulation){
      highState = item[1];
      maxPopulation = parseInt(item[0]);
    }
  })
  resultObj.totalPopulation = totalPopulation;
  resultObj.highState = highState;

  return resultObj;
}

function postData(data) {
  $('#totalUsPopulation').html(data.totalPopulation);
  $('#highestPopState').html(data.highState);
}
