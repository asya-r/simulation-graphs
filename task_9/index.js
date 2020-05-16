function execute() {
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});
  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);
}
function drawChart() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Exp');
  data.addColumn('number', 'Freq');
  var pr1=document.getElementById("p1").value;
  var pr2=document.getElementById("p2").value;
  var pr3=document.getElementById("p3").value;
  var pr4=document.getElementById("p4").value;
  var num=document.getElementById("num").value;
  data.addRows([
    ['1', generate(num, pr1)],
    ['2', generate(num, pr2)],
    ['3', generate(num, pr3)],
    ['4', generate(num, pr4)],
    ['5', generate(num, (1.0-pr1-pr2-pr3-pr4))]
  ]);

  // Set chart options
  var options = {'title':'Accuracy dependence on number of experiments',
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
