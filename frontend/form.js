
    	$(document).ready(function () {
			console.log("Ready is called");
			GetParams();
		});

		function SaveDataPatient(){
			
			$(`#FirstName`).prop('disabled',true);
			$(`#LastName`).prop('disabled',true);
			$(`#VisitID`).prop('disabled',true);
			$(`#PatientID`).prop('disabled',true);
			
			savePatient();
			$(`#saveBtnP`).html("Edit")
			$(`#saveBtnP`).attr('onclick','EditDataPatient()');
			CurrentPatientInformation();
			$(`#insertFirstName`).html($(`#FirstName`).val());
			$(`#insertLastName`).html($(`#LastName`).val());
			$(`#insertVisitID`).html($(`#VisitID`).val());
			$(`#insertPatientID`).html($(`#PatientID`).val());
			TableInitializer();
		  }
		function EditDataPatient(){
			$(`#FirstName`).prop('disabled',false);
			$(`#LastName`).prop('disabled',false);
			$(`#VisitID`).prop('disabled',false);
			$(`#PatientID`).prop('disabled',false);
			$(`#saveBtnP`).html('Save');
			$(`#saveBtnP`).attr('onclick','SaveDataPatient()');
			
		}
		function CurrentPatientInformation (){
			var code = `<hr>
			<h4>Current Patient Information</h4>
			<div id='myTable'>
				<div class="container pt-4">
					<div class="table-responsive">
						<table align="left" id="CurrentPatientInfo" class="table table-bordered">
							<tbody>
								<td id="CurrentFirstNameTag" class="text-left">
									<label for="FirstName">
										<b>First Name: </b>
										
									</label>
									<input id ="CurrentFirstName"  type="text"/>
								</td>

								<td id="CurrentLastNameTag" class="text-left">
									<label for="LastName">
										<b>Last Name: </b>
										
									</label>
									<input id ="CurrentLastName"  type="text"/>
								</td>

								<td id="CurrentVisitIdTag" class="text-left">
									<label for="VisitId">
										<b>Visit ID: </b>
										
									</label>
									<input id ="CurrentVisitId"  type="text"/>
									<select id="VisitidDropdown" onchange="ShowKnownProcedures()">
										<option></option>
									</select>
								</td>

								<td id="CurrentPatientIdTag" class="text-left">
									<label for="PatientId">
										<b>Patient ID: </b>
										
									</label>
									<input id ="CurrentPatientId"  type="text"/>
								</td>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			`
		$(`#PatientInfo`).html(code);
		$(`#VisitidDropdown`).hide();
		$(`#CurrentFirstName`).prop('disabled',true);
		$(`#CurrentLastName`).prop('disabled',true);
		$(`#CurrentVisitId`).prop('disabled',true);
		$(`#CurrentPatientId`).prop('disabled',true);

		$(`#CurrentFirstName`).val($(`#FirstName`).val());
		$(`#CurrentLastName`).val($(`#LastName`).val());
		$(`#CurrentVisitId`).val($(`#VisitID`).val());
		$(`#CurrentPatientId`).val($(`#PatientID`).val());

		
		}
		function TableInitializer(){
			var HeaderTableCode = `<div class="container pt-4">
			<div class="table-responsive">
			<table id="procedureTable" class="table table-bordered">
				<thead>
				<tr id="R0">
					<th class="text-center">procedure name </th>
					<th class="text-center">diagnostic type</th>
					<th class="text-center">date</th>
					<th class="text-center">
					<button class="btn btn-md btn-primary" id="addBtn" type="button" onclick="procedureRowAdd()">Add</button>
					</th>
				</tr>
				</thead>
				<tbody id="placeholder">

				</tbody>
			</table>
		</div>`
		$('#allPrints').html(HeaderTableCode);
		}
			function procedureRowAdd() {
				console.log("procedureRowAdd is called");
				var rowId=$("#procedureTable tr").length;
				var saveBtn = addSaveButton(rowId);
				var delBtn = addDeleteButton(rowId);
				var dateBtn = addDatePicker(rowId);
				var trCode=`<tr id='R${rowId}'>
							<td id='R${rowId}1'></td> 
							<td id='R${rowId}2'></td> 
							<td id='R${rowId}3'>${dateBtn}</td> 
							<td id='R${rowId}4'>${saveBtn}</td> 
							<td id='R${rowId}5'>${delBtn}</td> 
							</tr>
							<input type="hidden" id="P${rowId}">`;
				
				
				if(rowId === 1) {
					$("#placeholder").append(trCode);

				}
				else {
					$("#placeholder").prepend(trCode);
				}
				
				addDropDownOne(rowId);
				addDropDownTwo('EGD', 'dropone'+rowId);
				dateStr(rowId);
			}
			
			function addDatePicker(rowId){
				var button = `<input type = 'date' id = 'datepicker${rowId}' name = 'datepicker'>`
				return button;
			}
			function dateStr(rowId) {
				console.log("datestr is called");
				var today = new Date();
				$(`#datepicker${rowId}`).val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
			}
			function addSaveButton(rowId)  {
				console.log("addSaveButton is called");
				var button = `<button class="btn btn-md btn-primary" id="saveBtn${rowId}" type="button" onclick="editData(${rowId})">&#x1f4be</button>`;
			return button;
			}
			
			function editData(rowId) {
				var currentText = $(`#droptwo${rowId} option:selected`).text();
				var procedureText = $(`#dropone${rowId} option:selected`).text();
				var dateText = $(`#datepicker${rowId}`).val();
				var testingvar1 = $(`#droptwo${rowId} option:selected`).val();
				var guuid = saveProcedure(testingvar1,dateText);
				$(`#P${rowId}`).val(guuid);
				
				$(`#droptwo${rowId}`).remove();
				$(`#dropone${rowId}`).remove();
				$(`#datepicker${rowId}`).remove();
				$(`#R${rowId}2`).html(currentText);
				$(`#R${rowId}1`).html(procedureText);
				$(`#R${rowId}3`).html(dateText);
				$(`#saveBtn${rowId}`).html('&#x270D');
				$(`#saveBtn${rowId}`).attr("onclick",`saveData(${rowId})`);
			}
			 async function saveData(rowId){
				var ProcedureName = $(`#R${rowId}1`).text();
				var TypeProcedure = $(`#R${rowId}2`).text();
				var date = $(`#R${rowId}3`).text();
				$(`#R${rowId}2`).empty();
				$(`#R${rowId}1`).empty();
				$(`#R${rowId}3`).empty();
				addDropDownOne(rowId);
				await new Promise(r => setTimeout(r,100));	
				$(`#dropone${rowId} option`).filter(function(i,e) {
					return $(e).text().trim() == ProcedureName}).prop('selected',true);
				addDropDownTwo(ProcedureName, 'dropone'+rowId);
				$(`#droptwo${rowId}`).val(TypeProcedure);
				console.log(date);
				$(`#R${rowId}3`).html(`<input type = 'date' id = 'datepicker${rowId}' name='datepicker'>`);
				$(`#datepicker${rowId}`).val(date);
				$(`#saveBtn${rowId}`).html('&#x1f4be');
				$(`#saveBtn${rowId}`).attr("onclick",`editData(${rowId})`);
				
			}
			function addDeleteButton(rowId){
				var button = `<button class="btn btn-md btn-primary" id="delBtn${rowId}" type="button" onclick="delData(${rowId})">&#x1f5d1</button>`;
				return button;
			}
			function delData(rowId){
				if ($(`#P${rowId}`).val()) {
					delProcedure(rowId);
				}
				$(`#R${rowId}`).remove();
			}
			function addDropDownOne(rowId) {
				console.log("addDropDownOne is called");
				callAjax('http://localhost:3000/api/procedureDropdowns', 'GET').
				done(function(data, textStatus, jqXHR) {
					var select= `<select name="dropdown1" id="dropone${rowId}" onchange="getDropDown2(this)">`;
					procs=data;
					var optionString="";
					console.log("getting her");
					if(procs) {
						procs.forEach(element => {
							optionString = optionString + "<option value='"+element.category+"'>"+element.category+"</option>";
						});
						
					}
					select = select + optionString+"</select>";
					var key="#R"+rowId+"1";
					$(key).append(select);	
				})
				;
			}

			function addDropDownTwo(selectedItem, selectedId) {
				console.log("addDropDownTwo is called");
				var uri='http://localhost:3000/api/activities?procedureName='+selectedItem;
				var rowId= selectedId.replace("dropone", "");
				var secondId = selectedId.replace("one", "two");
				
				callAjax(uri, 'GET').
				done(function(data, textStatus, jqXHR) {
					acts=data.activities;
					var select= `<select name="dropdown2" id="${secondId}" >`;
					var optionString="";
					
					if(acts) {
						acts.forEach(element => {
							optionString = optionString + "<option value='"+element.code+"'>"+element.name+"</option>";
						});
						
					}
					select = select + optionString+"</select>";
					var key="#R"+rowId+"2";
					$(key).empty();
					$(key).append(select);	
					
				});
			}
				
			function getDropDown2(selected) {
				console.log("getDropDown2 is called");
				addDropDownTwo(selected.value,selected.id);
				
			}
			
			function savePatient(){
				
				var holdervar1 = $(`#VisitID`).val();
				var holdervar2 = $(`#PatientID`).val();
				var holdervar3 = $(`#FirstName`).val();
				var holdervar4 = $(`#LastName`).val();
				var myObject = new Object();
				
				myObject.patientid = holdervar2;
				myObject.firstName = holdervar3;
				myObject.lastName = holdervar4;
				myObject.middleName = "bob";
				myObject.gender = "M";
				myObject.visitid = holdervar1;
				var myStr = JSON.stringify(myObject);
				console.log(myStr);
				var url = 'http://localhost:3000/api/patients';
				var method = 'POST';
				callAjax(url,method,myStr);
			}
			
			function saveProcedure (dropdown2,date) {
				var holdervar1 = $(`#VisitID`).val();
				var today = new Date();
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				finalDate = date +" "+ time;
				
				var myObject = new Object();
				myObject.visitid = holdervar1;
				myObject.doctorid = 3;
				myObject.did = createUUID();//should be random id for each new row
				myObject.code = dropdown2;
				myObject.procedureTime = finalDate;
				
				var myStr = JSON.stringify(myObject);
				console.log(myStr);
				var url = 'http://localhost:3000/api/procedures';
				var method = 'POST';
				callAjax(url,method,myStr);
				return myObject.did;
			}

			function createUUID() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				   var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				   return v.toString(16);
				});
			 }

			function delProcedure (rowId) {
				
				var delRowHiddenID = $(`#P${rowId}`).val();
				
				var url = 'http://localhost:3000/api/procedures/' + delRowHiddenID;
				var method = 'DELETE';
				
				callAjax(url,method);
			}
			function DisplayMultiPatient () {
				var VisitID = $('#VisitID').val();
				var PatientID = $('#PatientID').val();
				var LastName = $('#LastName').val();
				var FirstName = $('#FirstName').val();
				$("#CurrentVisitId").remove()
				$(`#VisitidDropdown`).show();
				var url = 'http://localhost:3000/api/patients?visitid='+ VisitID + "&patientid=" + PatientID + "&firstname=" + FirstName + "&lastname=" + LastName;
				callAjax(url,'GET').
				done(function(data, textStatus, jqXHR) {
					console.log("console getting get call for patietn infop");
					var patientinfo = data;
					$(`#CurrentPatientId`).val(patientinfo[0].patientid);
					if (patientinfo) {
						patientinfo.forEach(element => {
							$(`#VisitidDropdown`).append(`<option value="${element.visitid}">${element.visitid}</option>`);
							
						});
					};
				});
			};
			function SearchPatient() {
				CurrentPatientInformation();
				DisplayMultiPatient();
			}
			function ShowKnownProcedures () {
				var CurrentOption = $(`#VisitidDropdown :selected`).val();
				var url = 'http://localhost:3000/api/doctorActivities?visitid=' + CurrentOption;
				callAjax(url,'GET').
				done(function(data,textStatus,jqXHR){
					
					var ProcedureList = data;
					TableInitializer();
					
					if (ProcedureList) {
						ProcedureList.forEach(element => {
							var rowId=$("#procedureTable tr").length;
							var saveBtn = addSaveButton(rowId);
							var delBtn = addDeleteButton(rowId);
							
							var trCode=`<tr id='R${rowId}'>
										<td id='R${rowId}1'></td> 
										<td id='R${rowId}2'></td> 
										<td id='R${rowId}3'></td> 
										<td id='R${rowId}4'>${saveBtn}</td> 
										<td id='R${rowId}5'>${delBtn}</td> 
										</tr>
										<input type="hidden" id="P${rowId}">`;
							if(rowId === 1) {
								$("#placeholder").append(trCode);

							}
							else {
								$("#placeholder").prepend(trCode);
							}
							console.log("this is row id "+ rowId);
							var currentTime = element.proceduretime;
							var justDate = currentTime.substring(0,10);
							
							$(`#P${rowId}`).val(element.did);
							$(`#R${rowId}2`).html(element.name);
							$(`#R${rowId}1`).html(element.category);
							$(`#R${rowId}3`).html(justDate);
							$(`#saveBtn${rowId}`).html('&#x270D');
							$(`#saveBtn${rowId}`).attr("onclick",`saveData(${rowId})`);
							 
						});
					};
				});
			}
			function GetParams() {
				const queryString = window.location.search;
				if (queryString.length<5) {
					return;
				}
				const urlParams = new URLSearchParams(queryString);
				
					const FirstName = urlParams.get("FirstName");
					console.log(FirstName);
					$(`#FirstName`).val(FirstName);
				
				
					const LastName = urlParams.get("LastName");
					console.log(LastName);
					$(`#LastName`).val(LastName);

				
			}
			function callAjax(uri, method, formData) {
				return $.ajax({
				url: uri,
				crossDomain:true,
				//dataType: 'json',
				contentType: 'application/json; charset=utf-8',
				accepts:'application/json',
				data: formData,
				type: method
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					$('#info').html('<p>An error has occurred</p>');
					alert('I am in ajax error');
				})
				.always(function(data, textStatus, jqXHR) {
					
					// do any cleanup
				});
			}