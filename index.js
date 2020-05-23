window.onload = function() {
  document.getElementById("btn9").onclick = function() {execute(9)};
  document.getElementById("btn11").onclick = function() {execute(11)};
  document.getElementById("btn12").onclick = function() {execute(12)};
  document.getElementById("btn13").onclick = function() {execute(13)};
  google.charts.load('current', {'packages':['corechart']});

  function execute(mode) {
    if (mode == 12) {
      matchResult();
    }
    else if (mode == 13) {
      google.charts.setOnLoadCallback(drawAnotherChart())
    }
    else {
      google.charts.setOnLoadCallback(drawChart(mode));
    }
  }

  function drawChart(mode) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Exp');
    data.addColumn('number', 'Freq');
    var pr1 = parseFloat(document.getElementById("p1").value);
    var pr2 = parseFloat(document.getElementById("p2").value);
    var pr3 = parseFloat(document.getElementById("p3").value);
    var pr4 = parseFloat(document.getElementById("p4").value);
    var pr5 = 1.0-pr1-pr2-pr3-pr4;
    var num = document.getElementById("num").value;

    var gen1 = generate(num, pr1);
    var gen2 = generate(num, pr2);
    var gen3 = generate(num, pr3);
    var gen4 = generate(num, pr4);
    var gen5 = generate(num, pr5);

    averageTh = pr1 + pr2*2 + pr3*3 + pr4*4 + pr5*5;
    averageR = gen1 + gen2*2 + gen3*3 + gen4*4 + gen5*5;
    averageDif = Math.abs(averageTh - averageR) / averageTh * 100;

    varianceTh = pr1 + pr2*4 + pr3*9 + pr4*16 + pr5*25 - averageTh**2;
    varianceR = Math.abs(gen1 + gen2*4 + gen3*9 + gen4*16 + gen5*25 - averageR**2);
    varianceDif = Math.abs(varianceTh - varianceR) / varianceTh * 100;

    chiSqTh = Math.abs((pr1*num)**2/(num*gen1)
              + (pr2*num)**2/(num*gen2)
              + (pr3*num)**2/(num*gen3)
              + (pr4*num)**2/(num*gen4)
              + (pr5*num)**2/(num*gen5)
              - num);
    if (chiSqTh < 11.07) {
      result = " < 11.07 (not rejected)"
    }
    else {
      result = " > 11.07 (rejected)";
    }

    data.addRows([
      ['1', gen1],
      ['2', gen2],
      ['3', gen3],
      ['4', gen4],
      ['5', gen5]
    ]);

    title = 'Accuracy dependence on number of experiments';
    if (mode == 11) {
      title = title.concat('\nAverage: ', averageR.toFixed(2), ', error = ', averageDif.toFixed(0), '%'
                          ,'\nVariance: ', varianceR.toFixed(2), ', error = ', varianceDif.toFixed(0), '%'
                          ,'\nChi-squared: ', chiSqTh.toFixed(2), result)
    }

    // Set chart options
    var options = {'title':title,
                   'width':700,
                   'height':500};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  function generate(num, prob) {
    var a = 0;
    for (let i = 0; i < num; i++) {
      t = Math.random();
      if (t < prob) {
        a += 1;
      }
    }
    return a / num;
  }
};
function poisson(intensity) {
  var m = 0;
  var s = 0;
  while (!(s < -intensity)) {
    var a = Math.random();
    s += Math.log(a);
    m += 1;
  }
  return m;
};

function matchResult() {
  var intens1 = document.getElementById("com1").value;
  var intens2 = document.getElementById("com2").value;
  var res1 = poisson(intens1);
  var res2 = poisson(intens2);
  document.getElementById('chart_div').innerHTML = '<br>Match result: ' + res1 + '/' + res2;
};

function drawAnotherChart() {
  var intensity = document.getElementById("intensity").value;
  var numExp = document.getElementById("numExp").value;
  var values = [['', 'value']];
  var pValues = [];
  for (let i = 0; i < numExp; i++) {
    let tmp = poisson(intensity);
    values.push([i, tmp]);
    pValues.push(tmp);
  }
  var data = google.visualization.arrayToDataTable(values);

  var averageR = average(pValues);
  var averageDif = Math.abs(intensity - averageR) / intensity * 100;

  var varianceR = variance(pValues, averageR);
  varianceDif = Math.abs(intensity - varianceR) / intensity * 100;

  chiSqR = chiSq(pValues, intensity);
  if (chiSqR < 11.07) {
    result = " < 11.07 (not rejected)"
  }
  else {
    result = " > 11.07 (rejected)";
  }

  title = 'Poisson distribution';
  title = title.concat('\nAverage: ', averageR.toFixed(2), ', error = ', averageDif.toFixed(0), '%'
                      ,'\nVariance: ', varianceR.toFixed(2), ', error = ', varianceDif.toFixed(0), '%'
                      ,'\nChi-squared: ', chiSqR.toFixed(2), result)
  var options = {
    title: title,
    curveType: 'function',
    legend: { position: 'bottom' },
    width:700,
    height:500
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

  chart.draw(data, options);
};

function average(arr) {
  const reducer = (acc, cur) => acc + cur;
  return arr.reduce(reducer) / arr.length;
};

function variance(arr, aver) {
  const reducer = (acc, cur) => acc + (cur - aver) ** 2;
  return arr.reduce(reducer) / (arr.length - 1);
};

function chiSq(arr, intensity) {
  chi = 0;
  for (let i = 0; i < arr.length; i++) {
    chi += i ** 2s / (arr.length * arr[i]);
  }
  return chi - arr.length;
}
