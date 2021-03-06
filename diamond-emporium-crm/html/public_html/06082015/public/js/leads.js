function getLeads(recordsPerPage, keyword){
	$('#searchResultsHint').text("");
	if(keyword != '' && keyword != undefined){
		var url = '/ajaxgetleads?keyword='+keyword;
	} else {
		var url = '/ajaxgetleads';
	}
	
	InitGrid();
	function InitGrid() {
		//$('#jqxWidget').jqxGrid('destroy');
		$('#jqxWidget').remove();
        $('#bindAfterThis').after('<div class="formTable manageMembers" id="jqxWidget"></div>');
	}
	
	// prepare the data
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'lead_id' },
			{ name: 'title' },
			{ name: 'first_name' },
			{ name: 'last_name' },
			{ name: 'email' },
			{ name: 'mobile' },
			{ name: 'product' },
			{ name: 'budget' },
			{ name: 'lead_owner' },
			{ name: 'priority' },
			{ name: 'note_description' },
			{ name: 'note_id' },
			{ name: 'created_date' }
		],
		//localdata: data,
		//id: 'ubd_id',
		cache: false,
		url: url,
		root: 'Rows',
		sortcolumn: 'created_date',
		sortdirection: 'desc',
		beforeprocessing: function (data) {
			source.totalrecords = data.TotalRows;
		},
		filter: function () {
			// update the grid and send a request to the server.
			$("#jqxWidget").jqxGrid('updatebounddata', 'filter');
		}
	};
	
	var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
		if (value > 0) {
		 var datarow = $('#jqxWidget').jqxGrid('getrowdata', row);
		 return '<div style="margin-top:15px; text-align:left;"><a href="javascript:;" onclick="javascript:getNotes('+recordsPerPage+', \'lead\', '+datarow.lead_id+', 1);" data-popup="editnoteslookup" class="lightBoxClick gridLink">Edit</a></div>';
		}
    };
	
	var pageable = true, sortable = true;
	
	var dataAdapter = new $.jqx.dataAdapter(source, {
		downloadComplete: function (data, status, xhr) { },
		loadComplete: function (data) { 
			if($("#jqxWidget").find('.jqx-grid-empty-cell').length>0 ){					
					if($("#jqxWidget").find('.jqx-grid-empty-cell').parent('div').height()<30){
						$('.jqx-grid-empty-cell').parent('div').addClass('norecordsFoundRow');
						$('.jqx-grid-empty-cell').closest("#jqxWidget").addClass('noInfoFound');
					}
					if(keyword){
						$("#jqxWidget").find('.jqx-grid-empty-cell >span').text("No matches were found");
						//$('#searchResultsHint').text("No matches were found");
					} else {
						$("#jqxWidget").find('.jqx-grid-empty-cell >span').text("No records found");
					}			
			}else{
				if($("#jqxWidget").hasClass('noInfoFound')){
					$("#jqxWidget").removeClass('noInfoFound');
				}
			}
		},
		loadError: function (xhr, status, error) { }
	});
	
	$("#jqxWidget").jqxGrid(
	{
		width: '100%',
		source: dataAdapter,
		//sortable: true,
		sorttogglestates:1,
		//showfilterrow: true,
		//filterable: true,
		pageable: pageable,
		sortable: sortable,
		pagesize: parseInt(recordsPerPage),
		pagesizeoptions: ['5', '10', '20', '50', '100'],
		autorowheight: true,
		autoheight: true,
		enabletooltips: true,
		rowsheight:50,
		columnsheight:50,
		pagerheight:50,
		//headerheight: 60,
		virtualmode: true,
		//pagermode: 'simple',
		//pager: '#gridpager',
		//columnsresize: true,
		rendergridrows: function (params) {
			return params.data;
		},
		columns: [
			{ text: 'Date <br/>Created', type: 'string', datafield: 'created_date', width:'8%' },
			//{ text: 'Status', type: 'string', datafield: 'email', width: 150 },
			//{ text: 'Last Contacted', type: 'string', datafield: 'email',width: 230 },
			{ text: 'First <br/> Name', type: 'string', datafield: 'first_name', width:'8%' },
			{ text: 'Last <br/> Name', type: 'string', datafield: 'last_name', width:'8%'},
			{ text: 'Mobile<br/>Number', type: 'string', datafield: 'mobile',width:'100' },
			{ text: 'Email', type: 'string', datafield: 'email', width:'25%' },
			{ text: 'Product', type: 'string', datafield: 'product', width:'90' },
			{ text: 'Budget', type: 'string', datafield: 'budget', width:'80' },
			{ text: 'Priority', type: 'string', datafield: 'priority', width:'10%' },
			{ text: 'Notes', type: 'string', datafield: 'note_description', width:'15%'},
			{ text: 'Edit <br> Notes', type: 'string', datafield: 'note_id', cellsrenderer: cellsrenderer, width:'80' },
			//{ text: 'Follow up Date', type: 'string', datafield: 'email' },
			{ text: 'Lead <br/> Owner', type: 'string', datafield: 'lead_owner', width:'12%' }
		]

	});

	//$("#jqxWidget").next('.pagerHTML').html($('#pagerjqxWidget'));	
	
	$('#jqxWidget').bind('cellclick', function(event) {
		var current_index = event.args.rowindex;
		var current_column = event.args.column.datafield;
		var datarow = $('#jqxWidget').jqxGrid('getrowdata', current_index);
		var url = '/leaddetails/'+datarow.lead_id;
		
		if(current_column != 'note_id'){
			$(location).attr('href', url);
		}
		$('#gridTypeId').val(datarow.lead_id);
		$('#gridType').val('lead');
		// Use datarow for display of data in div outside of grid
	});
	
	$("#jqxWidget").bind("sort", function (event) {
	    /*var sortinformation = event.args.sortinformation;
	    
	    var sortdatafield = sortinformation.sortcolumn;
	    
	    var sortorder = sortinformation.sortdirection.ascending ? "asc" : "desc";
	    
	    var sortUrl = '/ajaxgetleads?sortdatafield='+sortdatafield+'&sortorder='+sortorder;*/
	    
	   //$.get(sortUrl, function(source){
	    	//$("#jqxWidget").jqxGrid('databind', source);
	    	$("#jqxWidget").jqxGrid('updatebounddata', 'filter');
	   //});
	});
	
	$("#jqxWidget").bind("pagesizechanged", function (event) {
		var args = event.args;
		var pagenumber = args.pagenum;
		var pagesize = args.pagesize;
		$('#pageSizeGrabing').val(pagesize);
	});
}

function getLeadsFromGridView(recordsPerPage, columnList, keyword){
	$('#searchResultsHint').text("");
	if(keyword != '' && keyword != undefined){
		var url = '/ajaxgetleads?keyword='+keyword;
	} else {
		var url = '/ajaxgetleads';
	}
	// prepare the data
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'lead_id' },
			{ name: 'title' },
			{ name: 'first_name' },
			{ name: 'last_name' },
			{ name: 'email' },
			{ name: 'mobile' },
			{ name: 'product' },
			{ name: 'budget' },
			{ name: 'lead_source' },
			{ name: 'lead_type' },
			{ name: 'state' },
			{ name: 'lead_owner' },
			{ name: 'looking_for' },
			{ name: 'reference_product' },
			{ name: 'referred_by_customer' },
			{ name: 'preferred_contact' },
			{ name: 'priority' },
			{ name: 'note_description' },
			{ name: 'note_id' },
			{ name: 'created_date' }
		],
		//localdata: data,
		//id: 'ubd_id',
		cache: false,
		url: url,
		root: 'Rows',
		sortcolumn: 'created_date',
		sortdirection: 'desc',
		beforeprocessing: function (data) {
			source.totalrecords = data.TotalRows;
		},
		filter: function () {
			// update the grid and send a request to the server.
			$("#jqxWidget").jqxGrid('updatebounddata', 'filter');
		}
	};
	
	var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
		if (value > 0) {
		 var datarow = $('#jqxWidget').jqxGrid('getrowdata', row);
		 return '<div style="margin-top:15px; text-align:left;"><a href="javascript:;" onclick="javascript:getNotes('+recordsPerPage+', \'lead\', '+datarow.lead_id+', 1);" data-popup="editnoteslookup" class="lightBoxClick gridLink">Edit</a></div>';
		}
    }
	
	var pageable = true, sortable = true;
	var dataAdapter = new $.jqx.dataAdapter(source, {
		downloadComplete: function (data, status, xhr) { },
		loadComplete: function (data) { 
			if($("#jqxWidget").find('.jqx-grid-empty-cell').length>0){
					if($("#jqxWidget").find('.jqx-grid-empty-cell').parent('div').height()<30){
						$('.jqx-grid-empty-cell').parent('div').addClass('norecordsFoundRow');
						$('.jqx-grid-empty-cell').closest("#jqxWidget").addClass('noInfoFound');
					}
					if(keyword){
						$("#jqxWidget").find('.jqx-grid-empty-cell >span').text("No matches were found");
						//$('#searchResultsHint').text("No matches were found");
					} else {
						$("#jqxWidget").find('.jqx-grid-empty-cell >span').text("No records found");
					}
			}else{
				if($("#jqxWidget").hasClass('noInfoFound')){
					$("#jqxWidget").removeClass('noInfoFound');
				}
			}
		},
		loadError: function (xhr, status, error) { }
	});
	
	var colList = columnList.split(',');
		var gridColumnList = new Array();
		//gridColumnList.push($("#drop").val());
		if(colList.length>7){
		for(i = 0; i < colList.length; i++){
			if(colList[i] == 'created_date'){
				gridColumnList.push({ text: 'Date <br/>Created', type: 'string', datafield: 'created_date', width:'8%'});
			}
			if(colList[i] == 'first_name'){
				gridColumnList.push({ text: 'First <br/> Name', type: 'string', datafield: 'first_name', width:'8%'});
			}
			if(colList[i] == 'last_name'){
				gridColumnList.push({ text: 'Last <br/> Name', type: 'string', datafield: 'last_name', width:'8%' });
			}
			if(colList[i] == 'mobile'){
				gridColumnList.push({ text: 'Mobile <br/> Number', type: 'string', datafield: 'mobile', width:'10%' });
			}
			if(colList[i] == 'product'){
				gridColumnList.push({ text: 'Product', type: 'string', datafield: 'product', width:'10%'});
			}
			if(colList[i] == 'email'){
				gridColumnList.push({ text: 'Email', type: 'string', datafield: 'email', width:'25%' });
			}
			if(colList[i] == 'budget'){
				gridColumnList.push({ text: 'Budget', type: 'string', datafield: 'budget', width:'10%'});
			}
			if(colList[i] == 'priority'){
				gridColumnList.push({ text: 'Priority', type: 'string', datafield: 'priority', width:'10%' });
			}
			if(colList[i] == 'note_description'){
				gridColumnList.push({ text: 'Notes', type: 'string', datafield: 'note_description', width:'15%' });
			}
			if(colList[i] == 'note_id'){
				gridColumnList.push({ text: 'Edit Notes', type: 'string', datafield: 'note_id', cellsrenderer: cellsrenderer, width:'8%'});
			}
			if(colList[i] == 'lead_owner'){
				gridColumnList.push({ text: 'Lead Owner', type: 'string', datafield: 'lead_owner', width:'12%'});
			}
		}
			$("#jqxWidget").jqxGrid({columns:gridColumnList});
		}else{
		var countData = colList.length;
		var colWidthData = 100/countData;
		for(i = 0; i < colList.length; i++){
			if(colList[i] == 'created_date'){
				gridColumnList.push({ text: 'Date <br/>Created', type: 'string', datafield: 'created_date', width:colWidthData+'%'});
			}
			if(colList[i] == 'first_name'){
				gridColumnList.push({ text: 'First Name', type: 'string', datafield: 'first_name', width:colWidthData+'%'});
			}
			if(colList[i] == 'last_name'){
				gridColumnList.push({ text: 'Last Name', type: 'string', datafield: 'last_name' , width:colWidthData+'%'});
			}
			if(colList[i] == 'mobile'){
				gridColumnList.push({ text: 'Mobile	Number', type: 'string', datafield: 'mobile' , width:colWidthData+'%'});
			}
			if(colList[i] == 'product'){
				gridColumnList.push({ text: 'Product', type: 'string', datafield: 'product' , width:colWidthData+'%'});
			}
			if(colList[i] == 'email'){
				gridColumnList.push({ text: 'Email', type: 'string', datafield: 'email', width:colWidthData+'%'});
			}
			if(colList[i] == 'budget'){
				gridColumnList.push({ text: 'Budget', type: 'string', datafield: 'budget', width:colWidthData+'%'});
			}
			if(colList[i] == 'priority'){
				gridColumnList.push({ text: 'Priority', type: 'string', datafield: 'priority' , width:colWidthData+'%'});
			}
			if(colList[i] == 'note_description'){
				gridColumnList.push({ text: 'Notes', type: 'string', datafield: 'note_description', width:colWidthData+'%'});
			}
			if(colList[i] == 'note_id'){
				gridColumnList.push({ text: 'Edit Notes', type: 'string', datafield: 'note_id', cellsrenderer: cellsrenderer, width:colWidthData+'%'});
			}
			if(colList[i] == 'lead_owner'){
				gridColumnList.push({ text: 'Lead Owner', type: 'string', datafield: 'lead_owner', width:colWidthData+'%'});
			}
		}
			$("#jqxWidget").jqxGrid({columns:gridColumnList});
		}
	if(colList.length == gridColumnList.length){
		$("#jqxWidget").jqxGrid(
		{
			width: '100%',
			source: dataAdapter,
			//sortable: true,
			sorttogglestates:1,
			//showfilterrow: keyword ? false : true,
			//filterable: true,
			pageable: pageable,
			sortable: sortable,
			pagesize: parseInt(recordsPerPage),
			pagesizeoptions: ['5', '10', '20', '50', '100'],
			autorowheight: true,
			autoheight: true,
			enabletooltips: true,
			rowsheight:50,
			columnsheight:50,
			columns:gridColumnList,
			pagerheight: 50,
			//headerheight: 60,
			virtualmode: true,
			//pagermode: 'simple',
			//pager: '#gridpager',
			//columnsresize: true,
			rendergridrows: function (params) {
				return params.data;
			}
		});
	
		//$("#jqxWidget").next('.pagerHTML').html($('#pagerjqxWidget'));
		
		$('#jqxWidget').bind('cellclick', function(event)  {
			var current_index = event.args.rowindex;
			var current_column = event.args.column.datafield;
			var datarow = $('#jqxWidget').jqxGrid('getrowdata', current_index);
			var url = '/leaddetails/'+datarow.lead_id;
			
			if(current_column != 'note_id'){
				$(location).attr('href', url);
			}
			$('#gridTypeId').val(datarow.lead_id);
			$('#gridType').val('lead');
			// Use datarow for display of data in div outside of grid
		});
	}
	
	$("#jqxWidget").bind("sort", function (event) {
	    /*var sortinformation = event.args.sortinformation;
	    
	    var sortdatafield = sortinformation.sortcolumn;
	    
	    var sortorder = sortinformation.sortdirection.ascending ? "asc" : "desc";
	    
	    var sortUrl = '/ajaxgetleads?sortdatafield='+sortdatafield+'&sortorder='+sortorder;*/
	    
	   //$.get(sortUrl, function(source){
	    	//$("#jqxWidget").jqxGrid('databind', source);
	    	$("#jqxWidget").jqxGrid('updatebounddata', 'filter');
	   //});
	});
	
	$("#jqxWidget").bind("pagesizechanged", function (event) {
		var args = event.args;
		var pagenumber = args.pagenum;
		var pagesize = args.pagesize;
		$('#pageSizeGrabing').val(pagesize);
	});
}

function saveLead(form){
		$('#new_lead_btn').attr('disabled','disabled');
		
		var errors = validateLead();
		if(errors == 0){
			
			$('.lightBoxTitle .closePopup').click();
			
			var url = '/leads';
			var data = $(form).serialize();
			
			$.ajax({
				type: 'POST',
				url: url,
				async: false,
				data: data,
				success: function(response){
					if(response > 0){
						if(!$('input[name=lead_id]').val())
							window.location.href = '/leaddetails/'+response;
						else
							alert('Lead details updated successfully');
					}else{
						alert(response);
					}
				}
			});
		}
		
		$('#new_lead_btn').removeAttr('disabled');
}

function updateLead(form){
	if($('#leadActionButtonUnq').text() === "Edit"){
		$('#leadActionButtonUnq').text('Save');
		$('#frm_lead .displayHide').show();
		//$('#frm_lead #saveNoteButton').show();
		$('#frm_lead .hiddenUnqValues').hide();
		//$('#frm_lead #cancelNoteButton').show();
		//getNotes($('#recordsPerPage').val(), 'lead', $('#leadIdUnqIdenty').val(), 2);
	} else if($('#leadActionButtonUnq').text() === "Save"){
		$('#new_lead_btn').attr('disabled','disabled');
		
		var errors = validateLead();
		if(errors == 0){
			
			$('.lightBoxTitle .closePopup').click();
			
			var url = '/leads';
			var data = $(form).serialize();
			
			$.ajax({
				type: 'POST',
				url: url,
				async: false,
				data: data,
				success: function(response){
					if(response > 0){
						if(!$('input[name=lead_id]').val()){
							window.location.href = '/leaddetails/'+response;
						} else {
							//BOF Pushing New Values
							$('#priority_lead').text($('#priority').val());
							var lead_owner = $("#lead_owner option[value="+$('#lead_owner option:selected').val()+"]").text();
							if(lead_owner != 'Select'){
								$('#lead_owner_lead').text(lead_owner);
							} else {
								$('#lead_owner_lead').text('');
							}
							$('#title_lead').text($("#title option[value='"+$('#title option:selected').val()+"']").text());
							$('#first_name_lead').text($('#first_name').val());
							$('#last_name_lead').text($('#last_name').val());
							$('#mobile_lead').text($('#mobile').val());
							$('#email_lead').text($('#email').val());
							$('#product_lead').text($("#product option[value="+$('#product option:selected').val()+"]").text());
							$('#looking_for_lead').text($('#looking_for').val());
							$('#budget_lead').text($('#budget').val());
							$('#lead_source_lead').text($("#lead_source option[value='"+$('#lead_source option:selected').val()+"']").text());
							$('#referred_by_name_lead').text($('#referred_by_name').val());
							$('#state_lead').text($("#state option[value="+$('#state option:selected').val()+"]").text());
							$('#lead_type_lead').text($("#lead_type option[value="+$('#lead_type option:selected').val()+"]").text());
							$('#preferred_contact_lead').text($("#preferred_contact option:selected").text());
							$('#reference_product_lead').text($('#reference_product').val());
							//EOF Pushing New Values
							$('#leadActionButtonUnq').text('Edit');
							$('#frm_lead .displayHide').hide();
							//$('#frm_lead #saveNoteButton').hide();
							$('#frm_lead .hiddenUnqValues').show();
							//$('#frm_lead #cancelNoteButton').hide();
							//getNotes($('#recordsPerPage').val(), 'lead', $('#leadIdUnqIdenty').val(), 3);
							alert('Lead details updated successfully');
						}
					}else{
						alert(response);
					}
				}
			});
		}
		
		$('#new_lead_btn').removeAttr('disabled');
	}
}

function validateLead(){
	var errors = 0;
	$('.errorText').remove();
	
	if($('#frm_lead #title option:selected').val() == ''){
		$( '<p class="errorText">Please select a Title</p>' ).insertAfter( '#frm_lead #title' );
		errors++;
	}

	if($('#frm_lead #first_name').val() == ''){
		$( '<p class="errorText">Please enter First Name</p>' ).insertAfter( '#frm_lead #first_name' );
		errors++;
	}

	if($('#frm_lead #last_name').val() == ''){
		$( '<p class="errorText">Please enter Last Name</p>' ).insertAfter( '#frm_lead #last_name' );
		errors++;
	}

	/*if($('#frm_lead #mobile').val() == ''){
		$( '<p class="errorText">Please enter Mobile</p>' ).insertAfter( '#frm_lead #notAvailMobile' );
		errors++;
	}*/

	if($('#frm_lead #email').val() == '' && $('#frm_lead #mobile').val() == ''){
		$( '<p class="errorText">Please enter Mobile or Email</p>' ).insertAfter( '#frm_lead #email' );
		errors++;
	}
	
	if(!validateEmail($('#frm_lead #email').val())){
		$('<p class="errorText">Please enter valid email</p>').insertAfter('#frm_lead #email');
		errors++;
	}

	if($('#frm_lead #product option:selected').val() == 0){
		$( '<p class="errorText">Please enter Product</p>' ).insertAfter( '#frm_lead #product' );
		errors++;
	}

	if($('#frm_lead #budget').val() == ''){
		$( '<p class="errorText">Please enter Budget</p>' ).insertAfter( '#frm_lead #budget' );
		errors++;
	}

	if($('#frm_lead #lead_source option:selected').val() == 0){
		$( '<p class="errorText">Please enter Lead Source</p>' ).insertAfter( '#frm_lead #lead_source' );
		errors++;
	}

	if($('#frm_lead #state option:selected').val() == 0){
		$( '<p class="errorText">Please select a State</p>' ).insertAfter( '#frm_lead #state' );
		errors++;
	}

	if($('#frm_lead #lead_type option:selected').val() == 0){
		$( '<p class="errorText">Please select a Lead Type</p>' ).insertAfter( '#frm_lead #lead_type' );
		errors++;
	}
	
	return errors;
}

function customersLookup(recordsPerPage, selectedCustId, selectedCustName, keyword){
	$('#searchResultsHintjqxCustomers').text("");
	if(keyword)
		var url = '/ajaxcustomerslookup?keyword='+keyword;
	else
		var url = '/ajaxcustomerslookup';
	
	// prepare the data
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'id' },
			{ name: 'first_name' },
			{ name: 'last_name' },
			{ name: 'email' },
			{ name: 'mobile' },
		],
		//localdata: data,
		//id: 'ubd_id',
		cache: false,
		url: url,
		root: 'Rows',
		sortcolumn: 'id',
		sortdirection: 'desc',
		beforeprocessing: function (data) {
			source.totalrecords = data.TotalRows;
		},
		filter: function () {
			// update the grid and send a request to the server.
			$("#jqxCustomersLookup").jqxGrid('updatebounddata', 'filter');
		}
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source, {
		downloadComplete: function (data, status, xhr) { },
		loadComplete: function (data) { 
			if($("#jqxCustomersLookup").find('.jqx-grid-empty-cell').length>0){
					if($("#jqxCustomersLookup").find('.jqx-grid-empty-cell').parent('div').height()<30){
						$('.jqx-grid-empty-cell').parent('div').addClass('norecordsFoundRow');
						$('.jqx-grid-empty-cell').closest("#jqxCustomersLookup").addClass('noInfoFound');
					}
					if(keyword){
						$("#jqxCustomersLookup").find('.jqx-grid-empty-cell >span').text("No matches were found");
						//$('#searchResultsHintjqxCustomers').text("No matches were found");
					} else {
						$("#jqxCustomersLookup").find('.jqx-grid-empty-cell >span').text("No records found");
					}
			}else{
				if($("#jqxCustomersLookup").hasClass('noInfoFound')){
					$("#jqxCustomersLookup").removeClass('noInfoFound');
				}
			}
		},
		loadError: function (xhr, status, error) { }
	});
	
	$("#jqxCustomersLookup").jqxGrid(
	{
		width: "100%",
		source: dataAdapter,
		sortable: true,
		//showfilterrow: keyword ? false : true,
		//filterable: true,
		pageable: true,
		pagesize: parseInt(recordsPerPage),
		pagesizeoptions: ['5', '10', '20', '50', '100'],
		autorowheight: true,
		autoheight: true,
		enabletooltips: true,
		rowsheight:50,
		columnsheight:50,
		//pagermode: 'simple',
		pagerheight: 50,
		virtualmode: true,
		//columnsresize: true,
		rendergridrows: function (params) {
			return params.data;
		},
		columns: [
			{ text: 'First Name', type: 'string', datafield: 'first_name' },
			{ text: 'Last Name', type: 'string', datafield: 'last_name' },
			{ text: 'Mobile	Number', type: 'string', datafield: 'mobile' },
			{ text: 'Email', type: 'string', datafield: 'email', width:300 },
		]
	});
	
	$("#jqxCustomersLookup").next('.pagerHTML').html($('#pagerjqxCustomers'));
	
	$('#jqxCustomersLookup').jqxGrid('clearselection');
	
	$('#jqxCustomersLookup').bind('rowselect', function(event)  {
		var current_index = event.args.rowindex;
		var datarow = $('#jqxCustomersLookup').jqxGrid('getrowdata', current_index);
		
		$('#'+selectedCustId).val(datarow.id);
		$('#'+selectedCustName).val(datarow.first_name + ' ' + datarow.last_name);
		
		$('#customerlookup .closePopup').click();
		
		// Use datarow for display of data in div outside of grid
	});
	
	$("#jqxCustomersLookup").bind("sort", function (event) {
	    /*var sortinformation = event.args.sortinformation;
	    
	    var sortdatafield = sortinformation.sortcolumn;
	    
	    var sortorder = sortinformation.sortdirection.ascending ? "asc" : "desc";
	    
	    var sortUrl = '/ajaxcustomerslookup?sortdatafield='+sortdatafield+'&sortorder='+sortorder;*/
	    
	   //$.get(sortUrl, function(source){
	    	//$("#jqxCustomersLookup").jqxGrid('databind', source);
	    	$("#jqxCustomersLookup").jqxGrid('updatebounddata', 'filter');
	   //});
	});
}

function deleteLead(leadId){
	var url = '/deletelead';
	var data = {lead_id : leadId};
	$.post(url, data, function(response){
		if(response == 1){
			window.location.href = '/leads';
		}else{
			alert('Internal errors. Please try again.');
		}
	});
}

function convertLead(leadId){
	var url = '/convertleadform';
	var data = {lead_id : leadId};
	
	$.post(url, data, function(response){
		$('#suggested_customer').html(response);
		
		jQuery( ".dropdown1" ).dropkick({
	        mobile: true
		});
		
		lightboxmid();
		
		$('.datePickInput .datepickerInput').datepicker({
			dateFormat: 'dd/mm/yy',
			beforeShow: function() {
				$(this).after($(this).datepicker("widget"));
			}
		});
		
	});
	
	
	/*$.post(url, data, function(response){
		if(response == 1){
			window.location.href = '/customers';
		}else{
			alert('Internal errors. Please try again.');
		}
	});*/
}

function leadOpportunityLookup(recordsPerPage, mobile, email){
	$('#searchResultsHint').text("");
	var url = '/leadopportunitylookup';
	// prepare the data
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'id' },
			{ name: 'first_name' },
			{ name: 'last_name' },
			{ name: 'email' },
			{ name: 'mobile' },
		],
		//localdata: data,
		//id: 'ubd_id',
		cache: false,
		url: url,
		root: 'Rows',
		sortcolumn: 'id',
		sortdirection: 'desc',
		beforeprocessing: function (data) {
			source.totalrecords = data.TotalRows;
		},
		filter: function () {
			// update the grid and send a request to the server.
			$("#jqxCustomers").jqxGrid('updatebounddata', 'filter');
		}
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source, {
		downloadComplete: function (data, status, xhr) { },
		loadComplete: function (data) { 
			if($("#jqxCustomers").find('.jqx-grid-empty-cell').length>0){
					if($("#jqxCustomers").find('.jqx-grid-empty-cell').parent('div').height()<30){
						$('.jqx-grid-empty-cell').parent('div').addClass('norecordsFoundRow');
						$('.jqx-grid-empty-cell').closest("#jqxCustomers").addClass('noInfoFound');
					}
					if(keyword){
						$("#jqxCustomers").find('.jqx-grid-empty-cell >span').text("No matches were found");
						//$('#searchResultsHint').text("No matches were found");
					} else {
						$("#jqxCustomers").find('.jqx-grid-empty-cell >span').text("No records found");
					}
			}else{
				if($("#jqxCustomers").hasClass('noInfoFound')){
					$("#jqxCustomers").removeClass('noInfoFound');
				}
			}
		},
		loadError: function (xhr, status, error) { }
	});
	
	$("#jqxCustomers").jqxGrid(
	{
		width: "100%",
		source: dataAdapter,
		sortable: false,
		//showfilterrow: keyword ? false : true,
		//filterable: true,
		pageable: true,
		pagesize: parseInt(recordsPerPage),
		pagesizeoptions: ['5', '10', '20', '50', '100'],
		autorowheight: true,
		autoheight: true,
		enabletooltips: true,
		rowsheight:50,
		columnsheight:50,
		pagermode: 'simple',
		pagerheight: 0,
		virtualmode: true,
		//columnsresize: true,
		rendergridrows: function (params) {
			return params.data;
		},
		columns: [
			{ text: 'First Name', type: 'string', datafield: 'first_name' },
			{ text: 'Last Name', type: 'string', datafield: 'last_name' },
			{ text: 'Mobile	Number', type: 'string', datafield: 'mobile' },
			{ text: 'Email', type: 'string', datafield: 'email', width:300 },
		]
	});
	
	$('#jqxCustomers').jqxGrid('clearselection');
	
	//$("#jqxCustomers").next('.pagerHTML').html($('#pagerjqxCustomers'));
	$('#jqxCustomers').bind('rowselect', function(event)  {
		var current_index = event.args.rowindex;
		var datarow = $('#jqxCustomers').jqxGrid('getrowdata', current_index);
		
		/*$('#op_mobile').text(datarow.mobile);
		$('#op_email').text(datarow.email);
		
		$('#op_mobile_status').removeClass( "available" );
		$('#op_mobile_status').removeClass( "unavailable" );
		$('#op_email_status').removeClass( "available" );
		$('#op_email_status').removeClass( "unavailable" );
		
		if(mobile == datarow.mobile)
			$('#op_mobile_status').addClass("available" );
		else
			$('#op_mobile_status').addClass( "unavailable" );
		
		if(email == datarow.email)
			$('#op_email_status').addClass( "available" );
		else
			$('#op_email_status').addClass( "unavailable" );*/
		
		$('#customer_id').val(datarow.id);
		$('#customer_name').val(datarow.first_name + ' ' + datarow.last_name);
		
		$('#customerlookup .closePopup').click();
		
		// Use datarow for display of data in div outside of grid
	});
}

function saveConvert(form){
	
	$('#convert_bttn').attr('disabled','disabled');
	
	var errors = validateConvert();
	if(errors == 0){
		
		var url = '/convertlead';
		
		if(convertSelectedFiles.length > 0 && $('#convert_task_comment').val() == ''){
			$('#convert_task_comment').val(' ');
		}
		
		var formData = form.serialize();
		
		$.ajax({
			type: 'POST',
			url: url,
			async: false,
			data: formData,
			success: function(response){
				var responseData = JSON.parse(response);
				
				if(responseData.comment_id > 0 && convertSelectedFiles.length > 0){
					$('#convert_file_upload').uploadify('settings', 'formData', {'comment_id': responseData.comment_id});
					$('#convert_file_upload').uploadify('upload', '*');
					$('#convert_file_upload').uploadify('settings', 'onQueueComplete', function(queueData){
						
						var filesUploaded = '';
						for(i=0;i<convertFiles.length;i++){
							filesUploaded += convertFiles[i]+',';
						}
						
						var attachmentUrl = '/saveattachments';
						var attachmentData = {'comment_id': responseData.comment_id, files: filesUploaded};
						$.ajax({
							type: 'POST',
							url: attachmentUrl,
							async: false,
							data: attachmentData,
							success: function(attachmentResponse){
								
								convertFiles = new Array();
								convertSelectedFiles = new Array();
								
								$('.lightBoxTitle .closePopup').click();
								window.location.href = '/leads';
							}
						});
					});
				}
				
				if(convertSelectedFiles.length == 0 && responseData.customer_id > 0){
					$('.lightBoxTitle .closePopup').click();
					window.location.href = '/leads';
				}
			}
		});
	}

	$('#convert_bttn').removeAttr('disabled');
}

function validateConvert(){
	var errors = 0;
	$('.errorText').remove();
	
	if(($('#convert_assigned_to option:selected').val() > 0 || $('input[name=convert_due_date]').val() != '' || $('#convert_task_category option:selected').val() > 0 || $('#convert_task_priority option:selected').val() > 0 || $('#convert_task_subject option:selected').val() > 0 || $('#convert_task_comment').val() != '' || convertSelectedFiles.length > 0) && $('#convert_task_title').val() == ''){
		$('<p class="errorText">Please enter a task title</p>').insertAfter('#convert_task_title');
		errors++;
	}
	
	if($('#opportunity_name').val() == ''){
		$('<p class="errorText">Please enter opportunity name</p>').insertAfter('#opportunity_name');
		errors++;
	}
	
	if($('#progress_of_opportunity').val() == ''){
		$('<p class="errorText">Please select progress</p>').insertAfter('#progress_of_opportunity');
		errors++;
	}
	
	return errors;
}

function sendMailtoLeadOwner(ownerId, leadId){
	var url = '/sendmailtoleadowner';
	var data = {owner_id : ownerId, lead_id : leadId};
	$.ajax({
		type: 'POST',
		url: url,
		async: false,
		data: data,
		success: function(response){
			if(response > 0){
				alert(response);
			}
		}
	});
}

/* Customer Js */


function customersList(recordsPerPage, keyword){
	$('#searchResultsHint').text("");
	if(keyword != '' && keyword != undefined){
		var url = '/ajaxcustomerslist?keyword='+keyword;
	} else {
		var url = '/ajaxcustomerslist';
	}
	// prepare the data
	InitGrid();
	function InitGrid() {
		$('#jqxCustomers').remove();
        $('#bindAfterThis').after('<div class="formTable manageMembers" id="jqxCustomers" style="width:100%"></div>');
	}

	var pageable = true, sortable = true;
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'id' },
			{ name: 'fullname' },
			{ name: 'email' },
			{ name: 'mobile' },
			{ name: 'state_id' },
			{ name: 'state_name' },
			{ name: 'state_code' },
			{ name: 'owner_fullname' },
			{ name: 'partner_fullname' },
		],
		//localdata: data,
		//id: 'ubd_id',
		cache: false,
		url: url,
		root: 'Rows',
		//sortcolumn: 'id',
		//sortdirection: 'desc',
		beforeprocessing: function (data) {
			source.totalrecords = data.TotalRows;
		},
		filter: function () {
			// update the grid and send a request to the server.
			$("#jqxCustomers").jqxGrid('updatebounddata', 'filter');
		}
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source, {
		downloadComplete: function (data, status, xhr) { },
		loadComplete: function (data) { 
			if($("#jqxCustomers").find('.jqx-grid-empty-cell').length>0){
					if($("#jqxCustomers").find('.jqx-grid-empty-cell').parent('div').height()<30){
						$('.jqx-grid-empty-cell').parent('div').addClass('norecordsFoundRow');
						$('.jqx-grid-empty-cell').closest("#jqxCustomers").addClass('noInfoFound');
					}
					if(keyword){
						$("#jqxCustomers").find('.jqx-grid-empty-cell >span').text("No matches were found");
						//$('#searchResultsHint').text("No matches were found");
					} else {
						$("#jqxCustomers").find('.jqx-grid-empty-cell >span').text("No records found");
					}
					
			}else{
				if($("#jqxCustomers").hasClass('noInfoFound')){
					$("#jqxCustomers").removeClass('noInfoFound');
				}				
			}
		},
		loadError: function (xhr, status, error) { }
	});
	
	$("#jqxCustomers").jqxGrid(
	{
		width: "100%",
		source: dataAdapter,
		//sortable: true,
		sorttogglestates:1,
		//showfilterrow: keyword ? false : true,
		//filterable: true,
		pageable: pageable,
		sortable: sortable,
		pagesize: parseInt(recordsPerPage),
		pagesizeoptions: ['5', '10', '20', '50', '100'],
		autorowheight: true,
		autoheight: true,
		enabletooltips: true,
		rowsheight:50,
		columnsheight:50,
		//pagermode: 'simple',
		pagerheight: 50,
		virtualmode: true,
		//columnsresize: true,
		rendergridrows: function (params) {
			return params.data;
		},
		columns: [
			{ text: 'Customer Name', type: 'string', datafield: 'fullname', width:'15%' },
			{ text: 'Phone Number', type: 'string', datafield: 'mobile', width:'15%' },
			{ text: 'Email', type: 'string', datafield: 'email', width:'30%'},
			{ text: 'State', type: 'string', datafield: 'state_code', width:'10%' },
			{ text: 'Partner Name', type: 'string', datafield: 'partner_fullname', width:'15%' },
			{ text: 'Customer Owner', type: 'string', datafield: 'owner_fullname', width:'15%' },
		]
	});
	

	$('#jqxCustomers').bind('rowselect', function(event)  {
		var current_index = event.args.rowindex;
		var datarow = $('#jqxCustomers').jqxGrid('getrowdata', current_index);
		var url = '/customerdetails/'+datarow.id;
		
		$(location).attr('href', url);
		// Use datarow for display of data in div outside of grid
	});

	$("#jqxCustomers").bind("sort", function (event) {
	    /*var sortinformation = event.args.sortinformation;
	    
	    var sortdatafield = sortinformation.sortcolumn;
	    
	    var sortorder = sortinformation.sortdirection.ascending ? "asc" : "desc";
	    
	    var sortUrl = '/ajaxcustomerslist?sortdatafield='+sortdatafield+'&sortorder='+sortorder;*/
	    
	   //$.get(sortUrl, function(source){
	    	//$("#jqxCustomers").jqxGrid('databind', source);
	    	$("#jqxCustomers").jqxGrid('updatebounddata', 'filter');
	   //});
	});
	
	$("#jqxCustomers").bind("pagesizechanged", function (event) {
		var args = event.args;
		var pagenumber = args.pagenum;
		var pagesize = args.pagesize;
		$('#pageSizeGrabing').val(pagesize);
	});
}

function partnersLookup(recordsPerPage, customer_id, keyword){
	$('#searchResultsHintpartners').text("");
	if(keyword)
		var url = '/ajaxpartnerslookup/'+customer_id+'?keyword='+keyword;
	else
		var url = '/ajaxpartnerslookup/'+customer_id;
	// prepare the data
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'id' },
			{ name: 'first_name' },
			{ name: 'title' },
			{ name: 'last_name' },
			{ name: 'email' },
			{ name: 'mobile' },
			{ name: 'engagement_ring_size_left_text' },
			{ name: 'engagement_ring_size_left' },
			{ name: 'engagement_ring_size_right_text' },
			{ name: 'engagement_ring_size_right' },
			{ name: 'dress_ring_finger_text' },
			{ name: 'dress_ring_finger' },
			{ name: 'dress_ring_size_text' },
			{ name: 'dress_ring_size' },
			{ name: 'wedding_anniversary_date' },
			{ name: 'engagement_anniversary_date' },
			{ name: 'date_of_birth' },
			{ name: 'profession_text' },
			{ name: 'profession' },
			{ name: 'ethnicity_text' },
			{ name: 'ethnicity' },
			{ name: 'address1' },
			{ name: 'state_id' },
			{ name: 'state_code' },
			{ name: 'postcode' },
			{ name: 'country_id' },
			{ name: 'facebook' },
			{ name: 'instagram' },
			{ name: 'twitter' },
			{ name: 'googleplus' },
			
		],
		//localdata: data,
		//id: 'ubd_id',
		cache: false,
		url: url,
		root: 'Rows',
		sortcolumn: 'id',
		sortdirection: 'desc',
		beforeprocessing: function (data) {
			source.totalrecords = data.TotalRows;
		},
		filter: function () {
			// update the grid and send a request to the server.
			$("#jqxCustomers").jqxGrid('updatebounddata', 'filter');
		}
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source, {
		downloadComplete: function (data, status, xhr) { },
		loadComplete: function (data) { 
			if($("#jqxCustomers").find('.jqx-grid-empty-cell').length>0){
					if($("#jqxCustomers").find('.jqx-grid-empty-cell').parent('div').height()<30){
						$('.jqx-grid-empty-cell').parent('div').addClass('norecordsFoundRow');
						$('.jqx-grid-empty-cell').closest("#jqxCustomers").addClass('noInfoFound');
					}
					if(keyword){
						$("#jqxCustomers").find('.jqx-grid-empty-cell >span').text("No matches were found");
						//$('#searchResultsHintpartners').text("No matches were found");
					} else {
						$("#jqxCustomers").find('.jqx-grid-empty-cell >span').text("No records found");
					}
			}else{
				if($("#jqxCustomers").hasClass('noInfoFound')){
					$("#jqxCustomers").removeClass('noInfoFound');
				}
			}
		},
		loadError: function (xhr, status, error) { }
	});
	
	$("#jqxCustomers").jqxGrid(
	{
		width: "100%",
		source: dataAdapter,
		sortable: true,
		sorttogglestates:1,
		//showfilterrow: keyword ? false : true,
		//filterable: true,
		pageable: true,
		pagesize: parseInt(recordsPerPage),
		pagesizeoptions: ['5', '10', '20', '50', '100'],
		autorowheight: true,
		autoheight: true,
		enabletooltips: true,
		rowsheight:50,
		columnsheight:50,
		//pagermode: 'simple',
		pagerheight: 50,
		virtualmode: true,
		//columnsresize: true,
		rendergridrows: function (params) {
			return params.data;
		},
		columns: [
			{ text: 'First Name', type: 'string', datafield: 'first_name' },
			{ text: 'Last Name', type: 'string', datafield: 'last_name' },
			{ text: 'Mobile	Number', type: 'string', datafield: 'mobile' },
			{ text: 'Email', type: 'string', datafield: 'email', width:300 },
		]
	});
	
	$('#jqxCustomers').jqxGrid('clearselection');
	
	$("#jqxCustomers").bind("sort", function (event) {
	    /*var sortinformation = event.args.sortinformation;
	    
	    var sortdatafield = sortinformation.sortcolumn;
	    
	    var sortorder = sortinformation.sortdirection.ascending ? "asc" : "desc";
	    
	    var sortUrl = '/ajaxpartnerslookup?sortdatafield='+sortdatafield+'&sortorder='+sortorder;*/
	    
	   //$.get(sortUrl, function(source){
	    	//$("#jqxCustomers").jqxGrid('databind', source);
	    	$("#jqxCustomers").jqxGrid('updatebounddata', 'filter');
	   //});
	});
	
	//$("#jqxCustomers").next('.pagerHTML').html($('#pagerjqxCustomers'));
	
	$('#jqxCustomers').bind('rowselect', function(event)  {
		var current_index = event.args.rowindex;
		var datarow = $('#jqxCustomers').jqxGrid('getrowdata', current_index);
		
		$('#partner_id').val(datarow.id);
		$('#partnerFullName').html(datarow.first_name+' '+datarow.last_name);
		$('#mobile_text').text(datarow.mobile);
		$('#email_text').text(datarow.email);
		
		$('#engagement_ring_size_left_text').text(datarow.engagement_ring_size_left_text);
		$('#engagement_ring_size_right_text').text(datarow.engagement_ring_size_right_text);
		$('#dress_ring_finger_text').text(datarow.dress_ring_finger_text);
		$('#dress_ring_size_text').text(datarow.dress_ring_size_text);
		$('#wedding_anniversary_date_text').text(datarow.wedding_anniversary_date);
		$('#engagement_anniversary_date_text').text(datarow.engagement_anniversary_date);
		$('#date_of_birth_text').text(datarow.date_of_birth);
		$('#profession_text').text(datarow.profession_text);
		$('#ethnicity_text').text(datarow.ethnicity_text);
		
		$('#address1_text').text(datarow.address1);
		$('#state_code_text').text(datarow.state_code);
		$('#postcode_text').text(datarow.postcode);
		$('#country_id_text').text(datarow.country_id);
		
		$('#facebook_text').text(datarow.facebook);
		$('#instagram_text').text(datarow.instagram);
		$('#twitter_text').text(datarow.twitter);
		$('#googleplus_text').text(datarow.googleplus);
		
		// Populating form inputs
		$('#partner_engagement_ring_size_left').val(datarow.engagement_ring_size_left == null ? 0 : datarow.engagement_ring_size_left);
		$('#partner_engagement_ring_size_right').val(datarow.engagement_ring_size_right == null ? 0 : datarow.engagement_ring_size_right);
		$('#partner_dress_ring_finger').val(datarow.dress_ring_finger == null ? 0 : datarow.dress_ring_finger);
		$('#partner_dress_ring_size').val(datarow.dress_ring_size == null ? 0 : datarow.dress_ring_size);
		$('#partner_wedding_anniversary_date').val(datarow.wedding_anniversary_date);
		$('#partner_engagement_anniversary_date').val(datarow.engagement_anniversary_date);
		$('#partner_date_of_birth').val(datarow.date_of_birth);
		$('#partner_profession').val(datarow.profession);
		$('#partner_ethnicity').val(datarow.ethnicity);
		
		$('#partner_address1').val(datarow.address1);
		$('#partner_state_id').val(datarow.state_id);
		$('#partner_postcode').val(datarow.postcode);
		$('#partner_country_id').val(datarow.country_id);
		
		$('#partner_facebook').val(datarow.facebook);
		$('#partner_instagram').val(datarow.instagram);
		$('#partner_twitter').val(datarow.twitter);
		$('#partner_googleplus').val(datarow.googleplus);
		
		$('.assignPartner').hide();
		$('.assignPartnerEditBtns').show();
		$('.betaCulmn .cusomerViewBlock').removeClass('disabledMode');
		$('.betaCulmn .editInfo').hide();
		$('.betaCulmn .saveInfo').show();
		
		$('.betaCulmn').removeClass('malePartner');
		
		if(datarow.title == 'Mr')
			$('.betaCulmn').removeClass('malePartner').addClass('malePartner');	
		
		$('#customerlookup .closePopup').click();
		
		$('#frm_partner').find('select.dropdown').each(function(){
			if($(this).val()){													
				$('#'+$(this).prop('id')).dropkick('refresh');	
			}
		});
		
		$('#partner_info').show();
		var html = '<h2>'+datarow.first_name+' '+datarow.last_name+'</h2>';
		html += '<p>Ph: '+datarow.mobile+'<p>';
		html += '<p>E: '+datarow.email+'<p>';
		$('#partner_info .custonerInfo').html(html);
		
	});
}


function customersListFromGridView(recordsPerPage, columnList, keyword){
	$('#searchResultsHint').text("");
	if(keyword != '' && keyword != undefined){
		var url = '/ajaxcustomerslist?keyword='+keyword;
	} else {
		var url = '/ajaxcustomerslist';
	}
	// prepare the data
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: 'id' },
			{ name: 'fullname' },
			{ name: 'email' },
			{ name: 'mobile' },
			{ name: 'state_id' },
			{ name: 'state_name' },
			{ name: 'state_code' },
			{ name: 'owner_fullname' },
			{ name: 'partner_fullname' },
		],
		//localdata: data,
		//id: 'ubd_id',
		cache: false,
		url: url,
		root: 'Rows',
		//sortcolumn: 'id',
		//sortdirection: 'desc',
		beforeprocessing: function (data) {
			source.totalrecords = data.TotalRows;
		},
		filter: function () {
			// update the grid and send a request to the server.
			$("#jqxCustomers").jqxGrid('updatebounddata', 'filter');
		}
	};
	
	var pageable = true, sortable = true;
	var dataAdapter = new $.jqx.dataAdapter(source, {
		downloadComplete: function (data, status, xhr) { },
		loadComplete: function (data) { 
			if($("#jqxCustomers").find('.jqx-grid-empty-cell').length>0){
					if($("#jqxCustomers").find('.jqx-grid-empty-cell').parent('div').height()<30){
						$('.jqx-grid-empty-cell').parent('div').addClass('norecordsFoundRow');
						$('.jqx-grid-empty-cell').closest("#jqxCustomers").addClass('noInfoFound');
					}
					if(keyword){
						$("#jqxCustomers").find('.jqx-grid-empty-cell >span').text("No matches were found");
						//$('#searchResultsHint').text("No matches were found");
					} else {
						$("#jqxCustomers").find('.jqx-grid-empty-cell >span').text("No records found");
					}
			}else{
				if($("#jqxCustomers").hasClass('noInfoFound')){
					$("#jqxCustomers").removeClass('noInfoFound');
				}
			}
		},
		loadError: function (xhr, status, error) { }
	});
	
	var colList = columnList.split(',');
		var gridColumnList = new Array();
		var countData = colList.length;
		var colWidthData = 100/countData;
		//gridColumnList.push($("#drop").val());
		for(i = 0; i < colList.length; i++){
			if(colList[i] == 'fullname'){
				gridColumnList.push({ text: 'Customer Name', type: 'string', datafield: 'fullname', width:colWidthData+'%'});
			}
			if(colList[i] == 'mobile'){
				gridColumnList.push({ text: 'Phone Number', type: 'string', datafield: 'mobile', width:colWidthData+'%'});
			}
			if(colList[i] == 'email'){
				gridColumnList.push({ text: 'Email', type: 'string', datafield: 'email', width:colWidthData+'%'});
			}
			if(colList[i] == 'state_code'){
				gridColumnList.push({ text: 'State', type: 'string', datafield: 'state_code', width:colWidthData+'%'});
			}
			if(colList[i] == 'partner_fullname'){
				gridColumnList.push({ text: 'Partner Name', type: 'string', datafield: 'partner_fullname' , width:colWidthData+'%'});
			}
			if(colList[i] == 'owner_fullname'){
				gridColumnList.push({ text: 'Customer Owner', type: 'string', datafield: 'owner_fullname', width:colWidthData+'%'});
			}
		}
		$("#jqxCustomers").jqxGrid({columns:gridColumnList});
	if(colList.length == gridColumnList.length){
		$("#jqxCustomers").jqxGrid(
		{
			width: "100%",
			source: dataAdapter,
			//sortable: true,
			sorttogglestates:1,
			//showfilterrow: keyword ? false : true,
			//filterable: true,
			pageable: pageable,
			sortable: sortable,
			pagesize: parseInt(recordsPerPage),
			pagesizeoptions: ['5', '10', '20', '50', '100'],
			autorowheight: true,
			autoheight: true,
			enabletooltips: true,
			rowsheight:50,
			columnsheight:50,
			//pagermode: 'simple',
			pagerheight: 50,
			virtualmode: true,
			//columnsresize: true,
			rendergridrows: function (params) {
				return params.data;
			},
			columns:gridColumnList
		});
	}
	

	$('#jqxCustomers').bind('rowselect', function(event)  {
		var current_index = event.args.rowindex;
		var datarow = $('#jqxCustomers').jqxGrid('getrowdata', current_index);
		var url = '/customerdetails/'+datarow.id;
		
		$(location).attr('href', url);
		// Use datarow for display of data in div outside of grid
	});

	//$("#jqxCustomers").next('.pagerHTML').html($('#pagerjqxCustomers'));
	
	/*$("#jqxCustomers").next('.pagerHTML').html($('#pagerjqxCustomers'));
	
	$('#jqxCustomers').bind('rowselect', function(event)  {
		var current_index = event.args.rowindex;
		var datarow = $('#jqxCustomers').jqxGrid('getrowdata', current_index);
		
		$('#referred_by_customer').val(datarow.id);
		$('#referred_by_name').val(datarow.first_name + ' ' + datarow.last_name);
		
		var thisElm = $('#customerlookup .closePopup');
		$(thisElm).closest('.lightBox').animate({opacity:0}, 1000, function(){
			$(thisElm).closest('.lightBox').hide();
		});
		
		// Use datarow for display of data in div outside of grid
	});*/
	$("#jqxCustomers").bind("sort", function (event) {
	    /*var sortinformation = event.args.sortinformation;
	    
	    var sortdatafield = sortinformation.sortcolumn;
	    
	    var sortorder = sortinformation.sortdirection.ascending ? "asc" : "desc";
	    
	    var sortUrl = '/ajaxcustomerslist?sortdatafield='+sortdatafield+'&sortorder='+sortorder;*/
	    
	   //$.get(sortUrl, function(source){
	    	//$("#jqxCustomers").jqxGrid('databind', source);
	    	$("#jqxCustomers").jqxGrid('updatebounddata', 'filter');
	   //});
	});
	
	$("#jqxCustomers").bind("pagesizechanged", function (event) {
		var args = event.args;
		var pagenumber = args.pagenum;
		var pagesize = args.pagesize;
		$('#pageSizeGrabing').val(pagesize);
	});
}

function saveCustomer(customerForm){
	var errors = validateSaveCustomer();
	if(errors == 0){
		var url = '/savecustomer';
		var data = $(customerForm).serialize();
		$.post(url, data, function(response){
			if(response > 0){
				$('#profile_photo_uploader').uploadify('upload');
				customerForm.find('.editInfo').show().end().find('.saveInfo').hide();
				var fullname = '';
				$.each(data.split('&'), function (index, elem) {
					var vals = elem.split('=');
					
					if(vals[0] == 'wedding_anniversary_date' || vals[0] == 'engagement_anniversary_date' || vals[0] == 'date_of_birth'){
						var date = $('#'+vals[0]).val().split('/');
						var dateStr = date[0]+'/'+date[1]+'/'+date[2].substr(2, 2) ;
						
						$('#'+vals[0]).siblings('.inputVal').text(dateStr);
					}else if(vals[0] == 'first_name' || vals[0] == 'last_name'){
						fullname += $('#'+vals[0]).val()+' ';
					}else{
						if($('#'+vals[0]).attr('type') == 'text')
							$('#'+vals[0]).siblings('.inputVal').text($('#'+vals[0]).val());
						else
							$('#'+vals[0]).siblings('.inputVal').text($('#'+vals[0]+' option:selected').text());
							
						if(vals[0] == 'mobile' || vals[0] == 'email')
							$('#top_'+vals[0]).text($('#'+vals[0]).val());
					}
				});
				$('.alphaCulmn .fullname').text(fullname);
				$('#top_fullname').text(fullname);
				customerForm.find('.editViewField').hide();
				customerForm.find('.editViewField + .datePickCal').hide();
				customerForm.find('.inputVal').show();
				$('#profile_photo_uploader-button').hide();
				//getCount('customers');
				if($(customerForm).attr('id')=='frm_customer'){
					$('.cstmrDetails').removeClass('editMode');
				}
				//location.href='customerdetails/'+response;
				if($('#profile_photo_selected').val() == '')
					alert('Customer details updated successfully');
			}
		});
	}
}

function validateSaveCustomer(){
	var errors = 0;	
	$('.errorText').remove();
	
	var dow = $('#wedding_anniversary_date').val().split('/');
	var dowDate = new Date(dow[2], parseInt(dow[1], 10) - 1, dow[0]);
	var dowToTime = dowDate.getTime();
	
	var doe = $('#engagement_anniversary_date').val().split('/');
	var doeDate = new Date(doe[2], parseInt(doe[1], 10) - 1, doe[0]);
	var doeToTime = doeDate.getTime();
	
	var dob = $('#date_of_birth').val().split('/');
	var dobDate = new Date(dob[2], parseInt(dob[1], 10) - 1, dob[0]);
	var dobToTime = dobDate.getTime();
	
	if($.trim($('#first_name').val()) == ''){
		$('<p class="errorText">Please enter first name</p>').insertAfter('#first_name');
		errors++;		
	}
	
	if($.trim($('#last_name').val()) == ''){
		$('<p class="errorText">Please enter last name</p>').insertAfter('#last_name');
		errors++;		
	}
	
	if($.trim($('#mobile').val()) == ''){
		$('<p class="errorText">Please enter phone</p>').insertAfter('#mobile');
		errors++;		
	}else if(checkDuplicate('/checkduplicate/'+$('#customer_id').val(), 'mobile', $('#mobile').val()) > 0){
		$('<p class="errorText">Mobile no. already exists</p>').insertAfter('#mobile');
		errors++;
	}
	
	if($.trim($('#email').val()) == ''){
		$('<p class="errorText">Please enter email</p>').insertAfter('#email');
		errors++;		
	}else if(!validateEmail($('#email').val())){
		$('<p class="errorText">Please enter valid email</p>').insertAfter('#email');
		errors++;
	}else if(checkDuplicate('/checkduplicate/'+$('#customer_id').val(), 'email', $('#email').val()) > 0){
		$('<p class="errorText">Email address already exists</p>').insertAfter('#email');
		errors++;
	}
	
	if(($('#engagement_ring_size_left option:selected').val() == '' || $('#engagement_ring_size_left option:selected').val() == 0)
		|| ($('#engagement_ring_size_right option:selected').val() == '' || $('#engagement_ring_size_right option:selected').val() == 0)){
		$('<p class="errorText">Please select engagement ring size</p>').insertAfter('#engagement_ring_size_right');
		errors++;		
	}
	if(($('#dress_ring_finger option:selected').val() == '' || $('#dress_ring_finger option:selected').val() == 0)
		|| ($('#dress_ring_size option:selected').val() == '' || $('#dress_ring_size option:selected').val() == 0)){
		$('<p class="errorText">Please select dress ring size</p>').insertAfter('#dress_ring_size');
		errors++;		
	}
	if($('#wedding_anniversary_date').val() == ''){
		$('<p class="errorText">Please select wedding anniversary date</p>').insertAfter('#wedding_anniversary_date');
		errors++;		
	}else if(dowToTime < doeToTime){
		$('<p class="errorText">Wedding anniversary date must be greater than engagement anniversary date</p>').insertAfter('#wedding_anniversary_date');
		errors++;
	}else if(dowToTime < dobToTime){
		$('<p class="errorText">Wedding anniversary date must be greater than birth date</p>').insertAfter('#wedding_anniversary_date');
		errors++;
	}
	if($('#engagement_anniversary_date').val() == ''){
		$('<p class="errorText">Please select engagement anniversary date</p>').insertAfter('#engagement_anniversary_date');
		errors++;		
	}else if(doeToTime > dowToTime){
		$('<p class="errorText">Engagement anniversary date must be smaller than wedding anniversary date</p>').insertAfter('#engagement_anniversary_date');
		errors++;
	}else if(doeToTime < dobToTime){
		$('<p class="errorText">Engagement anniversary date must be smaller than birth date</p>').insertAfter('#engagement_anniversary_date');
		errors++;
	}
	if($('#date_of_birth').val() == ''){
		$('<p class="errorText">Please select date of birth</p>').insertAfter('#date_of_birth');
		errors++;		
	}else if(dobToTime > dowToTime){
		$('<p class="errorText">Birth date must be smaller than wedding anniversary date</p>').insertAfter('#date_of_birth');
		errors++;
	}else if(dobToTime > doeToTime){
		$('<p class="errorText">Birth date must be smaller than engagement anniversary date</p>').insertAfter('#date_of_birth');
		errors++;
	}
	if($('#profession option:selected').val() == '' || $('#profession option:selected').val() == 0){
		$('<p class="errorText">Please select profession</p>').insertAfter('#profession');
		errors++;		
	}
	if($('#ethnicity option:selected').val() == '' || $('#ethnicity option:selected').val() == 0){
		$('<p class="errorText">Please select ethnicity</p>').insertAfter('#ethnicity');
		errors++;		
	}
	if($('#address1').val() == ''){
		$('<p class="errorText">Please enter address1</p>').insertAfter('#address1');
		errors++;
	}
	if($('#country_id').val() == ''){
		$('<p class="errorText">Please enter country</p>').insertAfter('#country_id');
		errors++;
	}	
	if($('#state_id option:selected').val() == '' || $('#state_id option:selected').val() == 0){
		$('<p class="errorText">Please select state</p>').insertAfter('#state_id');
		errors++;
	}
	if($('#postcode').val() != '' && $('#postcode').val().length < 4){
		$('<p class="errorText">Please enter valid postcode</p>').insertAfter('#postcode');
		errors++;
	}
	return errors;
}

function deleteCustomer(customerId){
	var url = '/deletecustomer';
	var data = {customer_id : customerId};
	$.post(url, data, function(response){
		if(response == 1)
			window.location.href = '/customers';
	});
}

function savePartner(partnerForm){
	var errors = validateSavePartner();
	if(errors == 0){
		var url = '/savepartner';
		var data = $(partnerForm).serialize();
		$.post(url, data, function(response){
			if(response){
				partnerForm.find('.editInfo').show().end().find('.saveInfo').hide();
				$.each(data.split('&'), function (index, elem) {
					var vals = elem.split('=');				
					if($('#partner_'+vals[0]).attr('type') == 'text'){
						$('#partner_'+vals[0]).siblings('.inputVal').text($('#partner_'+vals[0]).val());
					}else
						$('#partner_'+vals[0]).siblings('.inputVal').text($('#partner_'+vals[0]+' option:selected').text());
				});
				partnerForm.find('.editViewField').hide();
				partnerForm.find('.editViewField + .datePickCal').hide();
				partnerForm.find('.inputVal').show();
				
				alert('Partner details updated successfully');
			}
		});
	}
}

function validateSavePartner(){
	var errors = 0;	
	$('.errorText').remove();
	
	var dow = $('#partner_wedding_anniversary_date').val().split('/');
	var dowDate = new Date(dow[2], parseInt(dow[1], 10) - 1, dow[0]);
	var dowToTime = dowDate.getTime();
	
	var doe = $('#partner_engagement_anniversary_date').val().split('/');
	var doeDate = new Date(doe[2], parseInt(doe[1], 10) - 1, doe[0]);
	var doeToTime = doeDate.getTime();
	
	var dob = $('#partner_date_of_birth').val().split('/');
	var dobDate = new Date(dob[2], parseInt(dob[1], 10) - 1, dob[0]);
	var dobToTime = dobDate.getTime();
	//alert($('#partner_engagement_ring_size_left option:selected').val()+'**');
	if(($('#partner_engagement_ring_size_left option:selected').val() == '' || $('#partner_engagement_ring_size_left option:selected').val() == 0)
		|| ($('#partner_engagement_ring_size_right option:selected').val() == '' || $('#partner_engagement_ring_size_right option:selected').val() == 0)){
		$('<p class="errorText">Please select engagement ring size</p>').insertAfter('#partner_engagement_ring_size_right');
		errors++;		
	}
	if(($('#partner_dress_ring_finger option:selected').val() == '' || $('#partner_dress_ring_finger option:selected').val() == 0)
		|| ($('#partner_dress_ring_size option:selected').val() == '' || $('#partner_dress_ring_size option:selected').val() == 0)){
		$('<p class="errorText">Please select dress ring size</p>').insertAfter('#partner_dress_ring_size');
		errors++;		
	}
	if($('#partner_wedding_anniversary_date').val() == ''){
		$('<p class="errorText">Please select wedding anniversary date</p>').insertAfter('#partner_wedding_anniversary_date');
		errors++;		
	}else if(dowToTime < doeToTime){
		$('<p class="errorText">Wedding anniversary date must be greater than engagement anniversary date</p>').insertAfter('#partner_wedding_anniversary_date');
		errors++;
	}else if(dowToTime < dobToTime){
		$('<p class="errorText">Wedding anniversary date must be greater than birth date</p>').insertAfter('#partner_wedding_anniversary_date');
		errors++;
	}
	if($('#partner_engagement_anniversary_date').val() == ''){
		$('<p class="errorText">Please select engagement anniversary date</p>').insertAfter('#partner_engagement_anniversary_date');
		errors++;		
	}else if(doeToTime > dowToTime){
		$('<p class="errorText">Engagement anniversary date must be smaller than wedding anniversary date</p>').insertAfter('#partner_engagement_anniversary_date');
		errors++;
	}else if(doeToTime < dobToTime){
		$('<p class="errorText">Engagement anniversary date must be smaller than birth date</p>').insertAfter('#partner_engagement_anniversary_date');
		errors++;
	}
	if($('#partner_date_of_birth').val() == ''){
		$('<p class="errorText">Please select date of birth</p>').insertAfter('#partner_date_of_birth');
		errors++;		
	}else if(dobToTime > dowToTime){
		$('<p class="errorText">Birth date must be smaller than wedding date</p>').insertAfter('#partner_date_of_birth');
		errors++;
	}else if(dobToTime > doeToTime){
		$('<p class="errorText">Birth date must be smaller than engagement date</p>').insertAfter('#partner_date_of_birth');
		errors++;
	}
	if($('#partner_profession option:selected').val() == '' || $('#partner_profession option:selected').val() == 0){
		$('<p class="errorText">Please select profession</p>').insertAfter('#partner_profession');
		errors++;		
	}
	if($('#partner_ethnicity option:selected').val() == '' || $('#partner_ethnicity option:selected').val() == 0){
		$('<p class="errorText">Please select ethnicity</p>').insertAfter('#partner_ethnicity');
		errors++;		
	}
	if($('#partner_address1').val() == ''){
		$('<p class="errorText">Please enter address1</p>').insertAfter('#partner_address1');
		errors++;
	}
	if($('#partner_country_id').val() == ''){
		$('<p class="errorText">Please enter country</p>').insertAfter('#partner_country_id');
		errors++;
	}	
	if($('#partner_state_id option:selected').val() == '' || $('#partner_state_id option:selected').val() == 0){
		$('<p class="errorText">Please select state</p>').insertAfter('#partner_state_id');
		errors++;
	}
	if($('#partner_postcode').val() != '' && $('#partner_postcode').val().length < 4){
		$('<p class="errorText">Please enter valid postcode</p>').insertAfter('#partner_postcode');
		errors++;
	}
	return errors;
}

function unassinPartner(customerId, partnerId, partnerForm){
	var url = '/unassignpartner';
	var data = {customer_id : customerId, partner_id : partnerId};
	
	//partnerForm.each(function() {
	partnerForm.find('input[type="text"]').val('');
	partnerForm.find('select').val(0);	
	
	  //});
	//$('.dropdown').dropkick('refresh');
	
	$.post(url, data, function(response){
		if(response){
			partnerForm.find('.assignPartner').show();
			partnerForm.find('.cusomerViewBlock').addClass('disabledMode');
			partnerForm.find('.assignPartnerEditBtns').hide();
			$('#frm_partner #partnerFullName').html('');
			$('#frm_partner #mobile_text').text('');
			$('#frm_partner #email_text').text('');
			partnerForm.find('select.dropdown').each(function(){
				$('#'+$(this).prop('id')).dropkick('refresh');	
			});
			$('#partner_info').hide();
		}
	});
}

function createNewCustomer(form, reloadGrig){
	
	$('#create_customer_btn').attr('disabled','disabled');
	var errors = validateCreateCustomer();
	
	if(errors == 0){
		var url = '/createcustomer';
		
		$('#new_customer_form .closePopup').click();
		
		$.ajax({
			type: 'POST',
			url: url,
			async: false,
			data: form.serialize(),
			success: function(response){
				if(response > 0){
					$('#frm_new_customer')[0].reset();
					if(reloadGrig)
						$("#"+reloadGrig).jqxGrid('updatebounddata', 'filter');
					else
						window.location.href = '/customerdetails/'+response;
				}else{
					alert('Internal error. Please try again.');	
				}
			}
		});
	}
	
	$('#create_customer_btn').removeAttr('disabled');
}

function validateCreateCustomer(){
	var errors =  0;
	
	$('.errorText').remove();
	
	if($('#title option:selected').val() == ''){
		$('<p class="errorText">Please select title</p>').insertAfter('#title');
		errors++;
	}
	if($('#first_name').val() == ''){
		$('<p class="errorText">Please enter first name</p>').insertAfter('#first_name');
		errors++;
	}
	if($('#last_name').val() == ''){
		$('<p class="errorText">Please enter last name</p>').insertAfter('#last_name');
		errors++;
	}
	if($('#customer_mobile').val() == ''){
		$('<p class="errorText">Please enter mobile</p>').insertAfter('#customer_mobile');
		errors++;
	}else if(checkDuplicate('/checkduplicate', 'mobile', $('#customer_mobile').val()) > 0){
		$('<p class="errorText">Mobile no. already exists</p>').insertAfter('#customer_mobile');
		errors++;
	}
	if($('#customer_email').val() == ''){
		$('<p class="errorText">Please enter email</p>').insertAfter('#customer_email');
		errors++;
	}else if(!validateEmail($('#customer_email').val())){
		$('<p class="errorText">Please enter valid email</p>').insertAfter('#customer_email');
		errors++;
	}else if(checkDuplicate('/checkduplicate', 'email', $('#customer_email').val()) > 0){
		$('<p class="errorText">Email address already exists</p>').insertAfter('#customer_email');
		errors++;
	}
	
	if($('#customer_address1').val() == ''){
		$('<p class="errorText">Please enter address1</p>').insertAfter('#customer_address1');
		errors++;
	}
	
	if($('#customer_postcode').val() != '' && $('#customer_postcode').val().length < 4){
		$('<p class="errorText">Please enter valid postcode</p>').insertAfter('#customer_postcode');
		errors++;
	}
	
	if($('#customer_country_id').val() == ''){
		$('<p class="errorText">Please enter country</p>').insertAfter('#customer_country_id');
		errors++;
	}
	if($('#customer_state_id option:selected').val() == '' || $('#customer_state_id option:selected').val() == 0){
		$('<p class="errorText">Please select state</p>').insertAfter('#customer_state_id');
		errors++;
	}
	
	return errors;
}

function checkDuplicate(url, checkfor, value){
	var count;
	$.ajax({
		type: 'POST',
		url: url,
		async: false,
		data: {
			'checkfor': checkfor,
			'value': value
		},
		success: function(response){
			count = response;
		}
	});

	return count;
}

function sameAddress(){
	if($('#frm_partner [type=checkbox]').is(":checked")){
		$('#partner_state_id option').each(function(index){
			if($( this ).val() == $('#state_id :selected').val()){
				$( this ).attr('selected', 'selected');
			}
		});
		
		$('#partner_address1').val($('#address1').val());
		$('#partner_postcode').val($('#postcode').val());
		$('#partner_country_id').val($('#country_id').val());
	}else{
		$('#partner_state_id option').each(function(index){
			if($( this ).val() == 0){
				$( this ).attr('selected', 'selected');
			}
		});
		
		$('#partner_address1').val('');
		$('#partner_postcode').val('');
		$('#partner_country_id').val('');
	}
	
	$('#frm_partner').find('select.dropdown').each(function(){
		if($(this).val()){													
			$('#'+$(this).prop('id')).dropkick('refresh');	
		}
	});
}
/* Customer Js End*/

function matchedCustomer(field, value){
	
	if(value != ''){
		if($('input[name=mobile_check]:checked').length == 0 && $('input[name=email_check]:checked').length == 0){
			$('#mobile').attr('readonly', false);
			$('#email').attr('readonly', false);
		}else{
			if(field == 'mobile'){
				$('input[name=email_check]').attr('checked', false);
				$('#email').attr('readonly', false);
				$('#mobile').attr('readonly', true);
			}
			if(field == 'email'){
				$('input[name=mobile_check]').attr('checked', false);
				$('#mobile').attr('readonly', false);
				$('#email').attr('readonly', true);
			}
			
			if(($('input[name=mobile_check]:checked').length > 0 && value != '') || ($('input[name=email_check]:checked').length > 0 && value != '')){
				var url = '/matchedcustomer';
				var data = {field: field, value: value};
				$.ajax({
					type: 'POST',
					url: url,
					//async: false,
					data: data,
					success: function(response){
						var responseData = JSON.parse(response);
						if(responseData.id){
							$('#first_name').val(responseData.first_name);
							$('#last_name').val(responseData.last_name);
							$('#mobile').val(responseData.mobile);
							$('#mobile').focus();
							$('#'+field).focus();
							$('#email').val(responseData.email);
							$('#looking_for').val(responseData.looking_for);
							$('#budget').val(responseData.budget);
							$('#reference_product').val(responseData.reference_product);
							$('#priority').val(responseData.priority);
							$('#title option').each(function(index){
								if($( this ).val() == responseData.title){
									$( this ).attr('selected', 'selected');
								}
							});
							$('#state option').each(function(index){
								if($( this ).val() == responseData.state_id){
									$( this ).attr('selected', 'selected');
								}
							});
							
							$('#frm_lead').find('select.dropdown').each(function(){
								if($(this).val()){													
									$('#'+$(this).prop('id')).dropkick('refresh');	
								}
							});
						}
					}
				});
			}
		}
	}else{
		alert('Please enter some value');
		$('input[name=mobile_check]').attr('checked', false);
		$('input[name=email_check]').attr('checked', false);
	}
}