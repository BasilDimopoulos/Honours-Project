
// Student access codes 
$(document).ready(function(){
    $("#accessCodes").click(function(){
        var output = "";
        $.get("/accessCodes.json", function(data){
            $.each(data, function(i, key){
                console.log(key);
                output += "<p><strong>"; 
                output += key.cellName;
                output += ":</strong> ";
                output += key.accessCode;
                if(key.claimed) {
                    output += " - Claimed by: ";
                    output += key.studentName; 
                }
                output += "</p>"
            });
        }).done(function(){
            $("#accessCodesList").html(output);
        }).error(function(){
            $("#accessCodesList").html("<p><strong>Failed to retrieve student codes</strong></p>");
        });
    });
});
