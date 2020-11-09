// Hover Tooltip
$(function () {
		$('[data-toggle="tooltip"]').tooltip({ boundary: 'window' });
});

// Appointment Customer Information Edit Enable
$('.info-edit-btn').click(function(e){
	e.preventDefault();
	$('.user-full-information-box').addClass('edit-visible');
});

// Appointment Customer Information Edit Cancel
$('.edit-cancel-button').click(function(e){
	e.preventDefault();
	$('.user-full-information-box').removeClass('edit-visible');
});

// Appointment Update Modal Show
$('.user-service-edit-btn').click(function(e){
	e.preventDefault();
	$('#editCreatedOneModal').addClass('modal-visible');
});
// Appointment Update Modal Hide
$('#editCreatedOneModal .user-edit-modal-cancel-button').click(function(e){
	e.preventDefault();
	$('#editCreatedOneModal').removeClass('modal-visible');
});

// Appointment Create New One Modal Show
$('.add-new-one-btn').click(function(e){
	e.preventDefault();
	$('#addNewOneModal').addClass('modal-visible');
});
// Appointment Create New One Modal Hide
$('.user-edit-modal-cancel-button').click(function(e){
	e.preventDefault();
	$('#addNewOneModal').removeClass('modal-visible');
});

// Appointment Select All Service Checkmark
$('.assign-all-service-checkmark').click(function(){
	if($(this).prop('checked') == true){
		$('.input-group').addClass('service-checked');
		$('.assign-service-checkmark').attr('checked','true');
	}else{
		$('.input-group').removeClass('service-checked');
		$('.assign-service-checkmark').removeAttr('checked');
	}
});

// Appointment Service Checkmark Icon Change
$('.assign-service-checkmark').click(function(){
	if($(this).prop('checked') == true){
		$(this).parent().parent().addClass('service-checked');
	}else{
		$(this).parent().parent().removeClass('service-checked');
	}
});

// Appointment Company Profile Edit Allow
$('#aCompanyProfileEdit').click(function(e){
	e.preventDefault();
	$('.company-detail-form').addClass('editable');
});
// Appointment Company Profile Edit Cancel
$('#aCompanyInfoEditBtn').click(function(){
	$('.company-detail-form').removeClass('editable');
});