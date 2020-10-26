
// Student access codes 
$(document).ready(function(){
    $("#accessCodes").click(function(){
        updateAccessCodes();
    });

    $("#policyCodes").click(function(){
        controlPolicyAvailability();
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
        $.each(data[lastMain].policies, function(i, key){
            output += '<div class="form-group form-inline col">';
            output += '<label for="policy-'+ i +'">' + key.policyName + ': </label>'
            output += '<input type="checkbox" class="pol-cont form-control ml-2" id="policy-'+ i +'" name="policy-'+ i +'"';
            if(!key.policyAvailable) output += ' disabled="disabled"';
            if(key.policyEnabled) output += ' checked="true"';        
            output += '>'
            output += '<input type="number" step="0.01" class="pol-cont form-control ml-2" id="policy-'+ i  +'-conform" name="policy-'+ i +'-conform" value='+ key.policyConform.toFixed(2);
            if(!key.policyAvailable) output += ' disabled="disabled"';        
            output += '>'
            output += '</div>'
            if(i%2 != 0) output += '<div class="w-100"></div>';
        });
        output += '<div class="w-100"></div>';
        output += '<div><button class="m-3 btn btn-primary" id="policy-update-btn" disabled="disabled" onclick="postPolicyChanges()">Update</button></div>';
    }).done(function(){
        $("#policy-controls").html(output);
        policyChanges();
    });
}
    

function controlPolicyAvailability(){
    var output = "";
    $.get("/policies.json", function(data){
        output += '<div>';
        $.each(data[0].policies, function(i, key){
            output += '<div class="form-group form-inline">';
            output += '<label for="policycontrol-'+ i +'">' + key.policyName + ': </label>'
            output += '<input type="checkbox" class="form-control ml-2" id="policycontrol-'+ i +'" name="policycontrol-'+ i +'"';
            if(key.policyAvailable) output += ' checked="true"';   
            output += '></div>';
        });
        output += '<input class="btn btn-primary form-control" type="submit" value="Submit" onclick="updatePolicyAvailability('+data[0].policies.length+');">'
        output += '</div>';
    }).done(function(){
        $("#policyAvailability").html(output);
    });
}

function updatePolicyAvailability(len){
    var states = [];
    for(var i = 0; i < len; i++){
        states.push($("#policycontrol-" + i).prop('checked'));
    }
    $.post("/policyAvailability", {data: states}).done(function(){
        displayPolicies();
        controlPolicyAvailability();
    });
}

// Check if there are any changes in the policy table
function policyChanges(){
    $(".pol-cont").on("change", function(){
        var change = false;
        $.get("/policies.json", function(data){
            $.each(data[lastMain].policies, function(i, key){
                if($("#policy-" + i).prop('checked') != data[lastMain].policies[i].policyEnabled){ change = true; } 
                if($("#policy-" + i + "-conform").val() != data[lastMain].policies[i].policyConform.toFixed(2)) { change = true; }
            });
        }).done(function(){
            $("#policy-update-btn").prop("disabled", !change);
        });
    });
};

// Post policy changes
function postPolicyChanges(){
    console.log("POST CHANGES");
    $.get("/policies.json", function(data){
        var out = [];
        $.each(data[lastMain].policies, function(i, key){
                var obj = new Object();
                obj.enabled = $("#policy-" + i).prop('checked');
                obj.conform = $("#policy-" + i + "-conform").val();
                out.push(obj);
        });
        out = { cell: lastMain, policies: out}
        $.post("/policyChanges", out ).done(function(){
            displayPolicies()
        });
    }); 
}