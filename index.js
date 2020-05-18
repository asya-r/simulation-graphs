window.onload = function() {
  document.getElementById("btn9").onclick = function() {execute(9)};
  document.getElementById("btn11").onclick = function() {execute(11)};

  function execute(mode) {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart(mode));
  }

  function drawChart(mode) {
    // Create the data table.
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

    varianceTh = pr1 + pr2*4 + pr3*9 + pr4*16 + pr5*25 - averageTh*averageTh;
    varianceR = Math.abs(gen1 + gen2*4 + gen3*9 + gen4*16 + gen5*25 - averageR*averageR);
    varianceDif = Math.abs(varianceTh - varianceR) / varianceTh * 100;

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
                          ,'\nChi-squared:')
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
