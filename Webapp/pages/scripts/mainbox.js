// Global Vars
var cellcont = [];
var cellCharts = [];
var mainLineChart;
var colours = [ "#FFCD40", "#4abdff", "#39E039", "#ce77e6", "#FF4040" ];
var lastMain = 0;
var seird_hidden = [false, false, false, false, false];
var latestServer = Date.now();

// Draw main cells
function mainCell(num){
    if(num == undefined) num = lastMain;
    lastMain = num;
    displayPolicies();
   
    if(mainLineChart != undefined) mainLineChart.destroy();
    
    updateDisplayValues(num);

    // Get array of time stamps for cells
    var times = [];
    for(var i = 0; i < cellcont[0]["susceptibles"].length; i++) times.push(i);

    // maincanvas-div
    $("#maincanvas-div").empty();
    $("#maincanvas-div").append("<canvas id='maincell' class='p-0 m-0' width=" + $("#maincanvas-div-table").width() + "px  style='height: 55vh;' ></canvas>");
    var mainchart = document.getElementById("maincell").getContext("2d");

    if(cellcont[num]["susceptibles"] != undefined){
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
                    legend: { display: ($("#fchartType").val() != "bar" && $("#fchartType").val() != "radar") && ($("#fchartType").val() != "horizontalBar")},
                    
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
                    legend: { display: true, beginAtZero: true },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{ ticks: { display: true, beginAtZero: true,
                            callback: function(label, index, labels) {
                                return numberlabel(label, 1);
                            }
                        }}],
                        xAxes: [{ position: 'bottom' }]
                    },
                }
            });
        }
    }
}

// Label Ticks Y Axis
function numberlabel(label, fixed){
    if(Number(label) >= 1e3 && Number(label) < 1e6){ return (label/1e3).toFixed(fixed) + ' K'; }
    if(Number(label) >= 1e6 && Number(label) < 1e9){ return (label/1e6).toFixed(fixed) + ' M'; }
    if(Number(label) >= 1e9){ return (label/1e9).toFixed(fixed) + ' B'; }
    return label
}

// Draw sidebar cells
function sideCells(){    
    if(cellcont[0]["susceptibles"] != undefined){

        // Get array of time stamps for cells
        var times = [];
        for(var i = 0; i < cellcont[0]["susceptibles"].length; i++) times.push(i);
        
        // Empty existing cell stack
        $("#cells-stack").empty();
        $.each(cellCharts, function(i, key){
            if(key != undefined) key.destroy();
        });
        cellCharts = [];

        // Go through JSON input and create Charts
        $.each(cellcont, function(i, key){
            
            // Append cells to div
            $("#cells-stack").append("<canvas id='sidecell-" + i + "' width=" + $("#cells-stack-table").width() + "px height=200px ></canvas>");
            if(i != (cellcont.length - 1)) $("#cells-stack").append("<hr />");
            var current = document.getElementById("sidecell-" + i).getContext("2d");
            
            // Create cell chat objects
            var newchart = new Chart(current, {
                type: "line",
                data:{
                    labels: times,
                    datasets:[
                        { label: "Susceptibles", data: key["susceptibles"], borderColor: colours[0], pointHighlightFill: colours[0], pointcolor: colours[0], fill: false, hidden: seird_hidden[0] },
                        { label: "Exposed", data: key["exposed"], borderColor: colours[1], pointHighlightFill: colours[1], pointcolor: colours[1], fill: false, hidden: seird_hidden[1] },
                        { label: "Infected", data: key["infected"], borderColor: colours[2], pointHighlightFill: colours[2], pointcolor: colours[2], fill: false, hidden: seird_hidden[2] },
                        { label: "Recovered", data: key["recovered"], borderColor: colours[3], pointHighlightFill: colours[3], pointcolor: colours[3], fill: false, hidden: seird_hidden[3] },
                        { label: "Deaths", data: key["deaths"], borderColor: colours[4], pointHighlightFill: colours[4], pointcolor: colours[4], fill: false, hidden: seird_hidden[4] },
                    ],
                },
                options: {
                    title: { display: true, text: key["name"] },
                    legend: { display: false },
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: [{ ticks: { display: true, beginAtZero: true, maxTicksLimit: 4,
                            callback: function(label, index, labels) {
                                return numberlabel(label, 1);
                            }
                        }}],
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
}

// make get request for json content
function getCells(referrer){
    $.getJSON("/model.json", function(data){
        if(data["status"] == "Successfully returned all cells"){         
            if(referrer == "interval"){
                if (JSON.stringify(cellcont) != JSON.stringify(data['cells'])){
                    cellcont = data['cells'];
                    sideCells();
                    mainCell();
                    displayPolicies();
                }
            }  else {                
                cellcont = data['cells'];
                sideCells();
                mainCell(0);
                displayPolicies(0);
            } 
        }
    });
}

// Main Javascript calls
$(document).ready(function(){
    getCells();     

    window.setInterval(function(){ getCells("interval"); }, 5000);
});
$( window ).resize(function(){
    getCells();
});

function updateDisplayValues(cell){
    var pop = cellcont[cell]["population"];
    var sper = ((cellcont[cell]["susceptibles"].slice(-1)[0]/pop)*100);
    var eper = ((cellcont[cell]["exposed"].slice(-1)[0]/pop)*100);
    var iper = ((cellcont[cell]["infected"].slice(-1)[0]/pop)*100);
    var rper = ((cellcont[cell]["recovered"].slice(-1)[0]/pop)*100);
    var dper = ((cellcont[cell]["deaths"].slice(-1)[0]/pop)*100);

    sper -= sper%.01; eper -= eper%.01; iper -= iper%.01; rper -= rper%.01; dper -= dper%.01;


    $("#display_time").text(cellcont[0]["susceptibles"].length - 1);
    $("#display_P").text(cellcont[cell]["population"]);
    $("#display_S").text(cellcont[cell]["susceptibles"].slice(-1)[0].toFixed(0) + " (" + sper.toFixed(2) + "%)");
    $("#display_E").text(cellcont[cell]["exposed"].slice(-1)[0].toFixed(0) + " (" + eper.toFixed(2) + "%)");
    $("#display_I").text(cellcont[cell]["infected"].slice(-1)[0].toFixed(0) + " (" + iper.toFixed(2) + "%)");
    $("#display_R").text(cellcont[cell]["recovered"].slice(-1)[0].toFixed(0) + " (" + rper.toFixed(2) + "%)");
    $("#display_D").text(cellcont[cell]["deaths"].slice(-1)[0].toFixed(0) + " (" + dper.toFixed(2) + "%)");
}

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

    $("#nextStep").click(function(){
        $.get("/nextStep").done(function(){
            getCells("interval");
        });
    });

    $("#nextStepn").click(function(){
        $.get("/nextStep/" + $("#nextStepn-value").val()).done(function(){
            getCells("interval");
        });
    });

});


// function testrun(){
//     $.each(cellCharts, function(i, key){
//         key.data.labels = [1,2,3,4];
//         key.data.datasets = [
//             { label: "Susceptibles", data: cellcont[i]["susceptibles"], borderColor: colours[0], pointHighlightFill: colours[0], fill: false, hidden: seird_hidden[0] },
//             { label: "Exposed", data: cellcont[i]["exposed"], borderColor: colours[1], pointHighlightFill: colours[1], fill: false, hidden: seird_hidden[1] },
//             { label: "Infected", data: cellcont[i]["infected"], borderColor: colours[2], pointHighlightFill: colours[2], fill: false, hidden: seird_hidden[2] },
//             { label: "Recovered", data: cellcont[i]["recovered"], borderColor: colours[3], pointHighlightFill: colours[3], fill: false, hidden: seird_hidden[3] },
//             { label: "Deaths", data: cellcont[i]["deaths"], borderColor: colours[4], pointHighlightFill: colours[4], fill: false, hidden: seird_hidden[4] },
//         ]
//         key.update();
//     });
// }
