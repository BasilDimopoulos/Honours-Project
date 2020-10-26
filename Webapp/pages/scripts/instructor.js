
// Student access codes 
$(document).ready(function(){
    $("#accessCodes").click(function(){
        updateAccessCodes();
    });
    displayPolicies();
});

// Update Access Codes
function updateAccessCodes(){
    // console.log("Hidden: " + $("#ModalCenterCont").is("aria-hidden"));
        
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
                output += "<button type='button' onclick='removeStudent("+'"'+key.accessCode+'"'+")' style='margin-top: -6px' class='float-right btn btn-secondary'>Remove</button>";
            }
            output += "</p><hr />";
        });
    }).done(function(){
        $("#accessCodesList").html(output);
    });
}

// Post student to be disconnected
function removeStudent(id){
    console.log("Remove user: " + id);
    $.post("/student/logoff", { accessCode: id }).done(function(){
        updateAccessCodes();
    });
}


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
            output += '<input type="number" class="form-control ml-2" id="policy-'+ i +'" name="policy-'+ i +'-conform" value='+ key.policyConform.toFixed(2);
            if(!key.policyAvailable) output += ' disabled="disabled"';        
            output += '>'
            output += '</div>'
            if(i%2 != 0) output += '<div class="w-100"></div>';
        });
    }).done(function(){
        $("#policy-controls").html(output);
    });
}
    