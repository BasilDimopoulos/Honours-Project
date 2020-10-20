// Global Vars
var cellcont = [];
var cellCharts = [];
var mainLineChart;
var colours = [ "#FFCD40", "#4abdff", "#39E039", "#ce77e6", "#FF4040" ];
var lastMain = 0;
var seird_hidden = [false, false, false, false, false];

// Draw main cells
function mainCell(num){
    if(num == undefined) num = lastMain;
    lastMain = num;

    var mainchart = document.getElementById("maincanvas").getContext("2d");
    if(mainLineChart != undefined) mainLineChart.destroy();
    $("#maincanvas").empty();
    if($("#fchartType").val() != "line"){
        mainLineChart = new Chart(mainchart, {
            type: $("#fchartType").val(),
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
                title: { display: true, text: cellcont[num]["name"] },
                legend: { display: ($("#fchartType").val() != "bar" && $("#fchartType").val() != "radar") },
            }
        });
    } else {
        mainLineChart = new Chart(mainchart, {
            type: "line",
            data:{
                labels: times,
                datasets:[
                    { label: "Susceptibles", data: cellcont[num]["susceptibles"], borderColor: colours[0], pointHighlightFill: colours[0], fill: false },
                    { label: "Exposed", data: cellcont[num]["exposed"], borderColor: colours[1], pointHighlightFill: colours[1], fill: false },
                    { label: "Infected", data: cellcont[num]["infected"], borderColor: colours[2], pointHighlightFill: colours[2], fill: false },
                    { label: "Recovered", data: cellcont[num]["recovered"], borderColor: colours[3], pointHighlightFill: colours[3], fill: false },
                    { label: "Deaths", data: cellcont[num]["deaths"], borderColor: colours[4], pointHighlightFill: colours[4], fill: false },
                ],
            },
            options: {
                title: { display: true, text: cellcont[num]["name"] },
                legend: { display: true },
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{ ticks: { display: true, beginAtZero: true }}],
                    xAxes: [{ position: 'bottom' }]
                }
            }
        });
    }
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
                    { label: "Susceptibles", data: key["susceptibles"], borderColor: colours[0], pointHighlightFill: colours[0], fill: false, hidden: seird_hidden[0] },
                    { label: "Exposed", data: key["exposed"], borderColor: colours[1], pointHighlightFill: colours[1], fill: false, hidden: seird_hidden[1] },
                    { label: "Infected", data: key["infected"], borderColor: colours[2], pointHighlightFill: colours[2], fill: false, hidden: seird_hidden[2] },
                    { label: "Recovered", data: key["recovered"], borderColor: colours[3], pointHighlightFill: colours[3], fill: false, hidden: seird_hidden[3] },
                    { label: "Deaths", data: key["deaths"], borderColor: colours[4], pointHighlightFill: colours[4], fill: false, hidden: seird_hidden[4] },
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
        if(data["status"] == "Successfully returned all cells"){
            cellcont = data['cells'];
            sideCells(data['cells']);
            mainCell(0);   
        }
    });
}


// Main Javascript calls
$(document).ready(function(){
    getCells();
});
$( window ).resize(function(){
    getCells();
});

function updateHidden(){
    $.each(cellCharts, function(i, key){
        key.getDatasetMeta(0).hidden=seird_hidden[0]; 
        key.getDatasetMeta(1).hidden=seird_hidden[1]; 
        key.getDatasetMeta(2).hidden=seird_hidden[2]; 
        key.getDatasetMeta(3).hidden=seird_hidden[3]; 
        key.getDatasetMeta(4).hidden=seird_hidden[4];         
        key.update();
    });
}

// SEIRD Greyscale disable for collumn chart
$(document).ready(function(){
    $("#label_S").click(function(){
        seird_hidden[0] = !seird_hidden[0];
        if(!seird_hidden[0]){ $("#label_S").css("background-color", colours[0]); } else { $("#label_S").css("background-color", "#909190"); }
        updateHidden();
    });

    $("#label_E").click(function(){
        seird_hidden[1] = !seird_hidden[1];
        if(!seird_hidden[1]){ $("#label_E").css("background-color", colours[1]); } else { $("#label_E").css("background-color", "#909190"); }
        updateHidden();
    });

    $("#label_I").click(function(){
        seird_hidden[2] = !seird_hidden[2];
        if(!seird_hidden[2]){ $("#label_I").css("background-color", colours[2]); } else { $("#label_I").css("background-color", "#909190"); }
        updateHidden();
    });

    $("#label_R").click(function(){
        seird_hidden[3] = !seird_hidden[3];
        if(!seird_hidden[3]){ $("#label_R").css("background-color", colours[3]); } else { $("#label_R").css("background-color", "#909190"); }
        updateHidden();
    });

    $("#label_D").click(function(){
        seird_hidden[4] = !seird_hidden[4];
        if(!seird_hidden[4]){ $("#label_D").css("background-color", colours[4]); } else { $("#label_D").css("background-color", "#909190"); }
        updateHidden();
    });

    $("#label_reset").click(function(){
        seird_hidden = [false, false, false, false, false];
        $("#label_S").css("background-color", colours[0]);
        $("#label_E").css("background-color", colours[1]);
        $("#label_I").css("background-color", colours[2]);
        $("#label_R").css("background-color", colours[3]);
        $("#label_D").css("background-color", colours[4]);
        updateHidden();
    });

});
