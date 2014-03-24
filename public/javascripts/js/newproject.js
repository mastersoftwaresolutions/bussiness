$(function(){
	$("#btnSubmit").click(function(){
		var selectedValues = $('#txtDeveloper').tokenInput("get"); // to get entered developers value
		var selectedKeyValues = $('#txtKeyWords').tokenInput("get");  // to get entered keys value
		$("#hdId").val("");
		$("#hdKeyId").val("");
		  $.each(selectedValues, function (i, item) {
            if ($("#hdId").val() == "") {
                $("#hdId").val(item.name);
            }
            else {
                $("#hdId").val($("#hdId").val() + ',' + item.name);
            }
        });
		   $.each(selectedKeyValues, function (i, item) {
            if ($("#hdKeyId").val() == "") {
                $("#hdKeyId").val(item.name);
            }
            else {
                $("#hdKeyId").val($("#hdKeyId").val() + ',' + item.name);
            }
        });
		
	});   
   
});
