$(document).ready(function(){
    var mainchart = document.getElementById("maincanvas").getContext("2d");
    var mainLineChart = new Chart(mainchart, {
        type: "doughnut",
        data:{
            labels: ["A", "B"],
            datasets:[{
                label: "Test",
                data: [ 55, 60 ],
                backgroundColor : [
                    "rgba(255, 299, 032, 0.6)",
                    "rgba(54, 162, 235, 0.6)"
                ] 
            }],
        },
        options:{
            responsive:true,
            maintainAspectRatio: false
        }
    });

    sideCells();
});

var cellCharts = [];

function sideCells(){    
    var cells = [ "SA", "NSW", "VIC", "WA", "QLD" ];
    $("#cells-stack").empty()
    cellCharts = [];
    colours = ["#FF4040", "#FFCD40", "#4B51D0", "#39E039", "#ce77e6" ];
    $.each(cells, function(i, key){
        $("#cells-stack").append("<canvas id='sidecell-" + i + "' width=400px height=200px ></canvas>");
        if(i != (cells.length - 1)) $("#cells-stack").append("<hr />");
        var current = document.getElementById("sidecell-" + i).getContext("2d");
        var newchart = new Chart(current, {
            type: "line",
            data:{
                labels:[1,2,3,4,5,6,7],
                datasets:[
                    {
                        label: "S",
                        data: [65, 59, 80, 81, 56, 55, 40],
                        borderColor: colours[0],
                        pointHighlightFill: colours[0],
                        fill: false
                    },
                    {
                        label: "E",
                        data: [28, 48, 40, 19, 86, 27, 90],
                        borderColor: colours[1],
                        pointHighlightFill: colours[1],
                        fill: false
                    },
                    {
                        label: "I",
                        data: [1,22,13,26,8,7,42],
                        borderColor: colours[2],
                        pointHighlightFill: colours[2],
                        fill: false
                    },
                    {
                        label: "R",
                        data: [13,4,37,42,10,29,21],
                        borderColor: colours[3],
                        pointHighlightFill: colours[3],
                        fill: false
                    },
                    {
                        label: "D",
                        data: [16,28,33,21,2,44,23],                        
                        borderColor: colours[4],
                        pointHighlightFill: colours[4],
                        fill: false
                    },
                    
                ],
            },
            options: {
                title: { display: true, text: key },
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        position: 'bottom'
                    }]
                }
            }
        });
    });
}