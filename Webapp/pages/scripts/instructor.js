
// Student access codes 
$(document).ready(function(){
    $("#accessCodes").click(function(){
        var output = "";
        $.get("/accessCodes.json", function(data){
            $.each(data, function(i, key){
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
        });
    });
    displayPolicies();
});


// Display Policies
function displayPolicies(){
    var output = "";
    $.get("/policies.json", function(data){
        $.each(data, function(i, key){
            output += '<div class="form-group form-inline col">';
            output += '<label for="policy-'+ i +'">' + key.policyName + ': </label>'
            output += '<input type="checkbox" class="form-control ml-2" id="policy-'+ i +'" name="policy-'+ i +'"';
            if(!key.policyAvailable) output += ' disabled="disabled"';
            if(key.policyEnabled) output += ' checked="true"';        
            output += '>'
            output += '<input type="number" class="form-control ml-2" id="policy-'+ i +'" name="policy-'+ i +'-conform" value='+ key.policyConform
            if(!key.policyAvailable) output += ' disabled="disabled"';        
            output += '>'
            output += '</div>'
            if(i%2 != 0) output += '<div class="w-100"></div>';
        });
    }).done(function(){
        $("#policy-controls").html(output);
    });
}
    