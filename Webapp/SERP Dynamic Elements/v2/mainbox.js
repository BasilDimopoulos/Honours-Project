$(document).ready(function(){
    var mainchart = document.getElementById("maincanvas").getContext("2d");
    var mainLineChart = new Chart(mainchart, {
        type: "pie",
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
});
