// Global Vars
var cellcont = [];
var cellCharts = [];
var mainLineChart;
var colours = [ "#FFCD40", "#4abdff", "#39E039", "#ce77e6", "#FF4040" ];

// Draw main cells
function mainCell(num){
    var mainchart = document.getElementById("maincanvas").getContext("2d");
    if(mainLineChart != undefined) mainLineChart.destroy();
    $("#maincanvas").empty()
    console.log()
    mainLineChart = new Chart(mainchart, {
        type: "doughnut",
        data:{
            labels: ["Susceptible", "Exposed", "Infected", "Recovered", "Deaths"],
            datasets:[{
                label: "Test",
                data: [ 
                    cellcont[num]["susceptibles"].slice(-1)[0], 
                    cellcont[num]["exposed"].slice(-1)[0], 
                    cellcont[num]["infected"].slice(-1)[0], 
                    cellcont[num]["recovered"].slice(-1)[0], 
                    cellcont[num]["deaths"].slice(-1)[0]
                ],
                backgroundColor : colours
            }],
        },
        options:{
            responsive:true,
            maintainAspectRatio: false,
            title: { display: true, text: cellcont[num]["name"] }
        }
    });
}

// Draw sidebar cells
function sideCells(content){    
    // Get array of time stamps for cells
    times = [];
    for(var i = 0; i < content[0]["population"].length; i++) times.push(i);
    
    // Empty existing cell stack
    $("#cells-stack").empty();
    $.each(cellCharts, function(i, key){
        if(key != undefined) key.destroy();
    });
    cellCharts = [];

    // Go through JSON input and create Charts
    $.each(content, function(i, key){
        $("#cells-stack").append("<canvas id='sidecell-" + i + "' width=" + $("#cells-stack-table").width() + "px height=200px ></canvas>");
        if(i != (content.length - 1)) $("#cells-stack").append("<hr />");
        var current = document.getElementById("sidecell-" + i).getContext("2d");
        isfirst = (i == 0);
        
        // Create cell chat objects
        var newchart = new Chart(current, {
            type: "line",
            data:{
                labels: times,
                datasets:[
                    { label: "S", data: key["susceptibles"], borderColor: colours[0], pointHighlightFill: colours[0], fill: false },
                    { label: "E", data: key["exposed"], borderColor: colours[1], pointHighlightFill: colours[1], fill: false },
                    { label: "I", data: key["infected"], borderColor: colours[2], pointHighlightFill: colours[2], fill: false },
                    { label: "R", data: key["recovered"], borderColor: colours[3], pointHighlightFill: colours[3], fill: false },
                    { label: "D", data: key["deaths"], borderColor: colours[4], pointHighlightFill: colours[4], fill: false },
                ],
            },
            options: {
                title: { display: true, text: key["name"] },
                legend: { display: false },
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{ ticks: { display: false, beginAtZero: true }}],
                    xAxes: [{ position: 'bottom' }]
                },
                onClick: function(event, array) {
                    mainCell(i);
                }
            }
        });
        cellCharts.push(newchart);
    });
}

// make get request for json content
function getCells(){
    $.getJSON("/testing.json", function(data){
        cellcont = data['cells'];
        sideCells(data['cells']);
        mainCell(0);   
    });
}


// Main Javascript calls
$(document).ready(function(){
    getCells();
});
$( window ).resize(function(){
    getCells();
});

