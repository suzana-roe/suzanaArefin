$(document).ready(function () {
    populatePersonnelTable();
    populateDepartmentTable();
    populateLocationTable();

});

//**GENERATING PERSONNEL, DEPARTMENT AND LOCATION TABLES**//

//Generating Personnel Table 
function populatePersonnelTable() {

    $.ajax({
        url: "./php/getAll.php",
        type: 'GET',
        dataType: 'json',
        success: function (results) {

            let data = results["data"];
            let tr = ``;
            //console.log('populate personnel', data)


            for (let i = 0; i < data.length; i++) {
                tr += `<tr>
                
                <td>${data[i].lastName + ',' + data[i].firstName}</td> 
                <td class="d-none d-md-table-cell">${data[i].department}</td> 
                <td class="d-none d-md-table-cell">${data[i].location}</td>
                <td> <button onclick="viewpersonnelbyid('${data[i].id}')" class="btn btn fa  fa-eye custom-button"></button></td> 
                <td> <button onclick="deletepersonnelbyId('${data[i].id}')" class="btn btn fa  fa-trash custom-button"></button></td> 
                <td> <button onclick="editpersonnelbyId('${data[i].id}')"class="btn btn fa  fa-pen custom-button"></button></td>
                
               
                </tr>`;
            };

            $('#personnel-table-body').html(tr).sort(function (a, b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

}


//Generating Department Table 
function populateDepartmentTable() {

    $.ajax({
        url: "./php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',
        success: function (results) {

            let data = results["data"];
            let tr = ``;
            //console.log('populate department', data)


            for (let i = 0; i < data.length; i++) {
                tr += `<tr>
                <td>${data[i].name}</td>
                <td>${data[i].location}</td>
                <td><button  data-id="${data[i].id}"  onclick="departmentdependencies('${data[i].id}')" class="btn btn fa  fa-trash custom-button"></button></td>
                <td><button onclick="editdepartmentbyId('${data[i].id}')"class="btn btn fa  fa-pen custom-button"></button></td>

                    </tr>`;


            };

            $('#department-table-body').html(tr);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

}

//Generating Location Table 
function populateLocationTable() {
    $.ajax({
        url: "./php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',
        success: function (results) {

            let data = results["data"];
            let tr = ``;
            //console.log('populate location', data)


            for (let i = 0; i < data.length; i++) {
                tr += `<tr>
                <td>${data[i].location}</td>
                <td><button data-id="${data[i].locationID}" onclick="locationdependencies('${data[i].locationID}')" class="btn btn fa  fa-trash custom-button"></button></td>
                <td><button onclick="editlocationbyId('${data[i].locationID}')"class="btn btn fa  fa-pen custom-button"></button></td>

                    </tr>`;
            };

            $('#location-table-body').html(tr);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

}

//Generating Department list for add/edit personnel/department modal
function populateDepartmentlist() {

    $.ajax({
        url: "./php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            //console.log(result, 'department list')

            if (result.status.name == "ok") {
                for (var i = 0; i < result.data.length; i++) {
                    $("#addEmployeeDepartment").append(
                        $("<option>", {
                            value: result.data[i].id,
                            text: result.data[i].name,
                        })
                    );
                    $("#editEmployeeDepartment").append(
                        $("<option>", {
                            value: result.data[i].id,
                            text: result.data[i].name,
                        })
                    );
                    $("#searchByDepartment").append(
                        $("<option>", {
                            value: result.data[i].id,
                            text: result.data[i].name,
                        })
                    );

                }
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

}

$("#add-btn").click(function () {
    populateDepartmentlist()
});


$("#searchByDepartment").click(function () {
    populateDepartmentlist()
});

$("#home-btn").click(function () {
    populatePersonnelTable()
});

//Generating Location list for add personnel and add/edit department modals
function populateLocationlist() {

    $.ajax({
        url: "./php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            //console.log(result, 'location list')

            if (result.status.name == "ok") {
                for (var i = 0; i < result.data.length; i++) {
                    $("#addEmployeeLocation").append(
                        $("<option>", {
                            text: result.data[i].location,
                            value: result.data[i].locationID,

                        })
                    );
                    $("#locationSelectForAddDept").append(
                        $("<option>", {
                            text: result.data[i].location,
                            value: result.data[i].locationID,

                        })
                    );
                    $('#editDepartmentLocationSelect').append(
                        $("<option>", {
                            value: result.data[i].locationID,
                            text: result.data[i].location,
                        })
                    );
                    $("#searchByLocation").append(
                        $("<option>", {
                            text: result.data[i].location,
                            value: result.data[i].id,

                        })
                    );
                }
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

}

$("#add-btn").click(function () {
    populateLocationlist()
});

$("#add-department").click(function () {
    populateLocationlist()
});


$("#searchByLocation").click(function () {
    populateLocationlist()
});

//**CRUD FUNCTIONALITIES**//

//**ADDING PERSONNEL**//Adding new personnel to database via modal

$("#submit-btn").click(function () {


    $.ajax({
        url: "./php/insertPersonnel.php",
        type: 'POST',
        dataType: 'json',
        data: {

            firstName: $('#addEmployeeFirstName').val(),
            lastName: $('#addEmployeeLastName').val(),
            email: $('#addEmployeeEmail').val(),
            jobTitle: $('#addEmployeeJobTitle').val(),
            departmentID: $('#addEmployeeDepartment').val()


        },
        success: function (data, status) {
            //console.log(status, 'add new personnel');

            populatePersonnelTable();
            $('#add-modal').modal("hide");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },

    });

});

//**ADDING LOCATION**//Adding new location to database via modal

$("#loc-submit-btn").click(function () {


    $.ajax({
        url: "./php/insertLocation.php",
        type: 'POST',
        dataType: 'json',
        data: {

            name: $('#addLocationName').val(),

        },
        success: function (data, status) {
            //console.log(status, 'add new location');

            populateLocationTable();
            $('#add-locmodal').modal("hide");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },

    });

});

//**ADDING DEPARTMENT**//Adding new department to database via modal

$("#dep-submit-btn").click(function () {


    $.ajax({
        url: "./php/insertDepartment.php",
        type: 'POST',
        dataType: 'json',
        data: {

            name: $('#departmentName').val(),
            locationID: $('#locationSelectForAddDept').val()

        },
        success: function (data, status) {
            //console.log(status, 'add new location');

            populateDepartmentTable();
            $('#add-depmodal').modal("hide");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },

    });

});


//Getting department details by id

function viewdepartmentbyid(depId) {

    $.ajax({
        type: "POST",
        url: "./php/getDepartmentByID.php",
        data: {
            id: depId,
        },
        success: function (result) {
            //console.log(result, "department")


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });
};

//**READ PERSONNEL DETAILS**//Getting specific personnel details by id

function viewpersonnelbyid(personnelId) {


    $.ajax({
        type: "POST",
        url: "./php/getPersonnelByID.php",
        data: {
            id: personnelId,
        },
        success: function (result) {
            //console.log(result, "specific personnel")

            if (result['data']['personnel'][0]['jobTitle'] !== "") {

                $('#userSelectModalLabel').html(`${result['data']['personnel'][0]['firstName']} ${result['data']['personnel'][0]['lastName']}`);
                //$('#user_id').val(result['data']['personnel'][0]['id']);
                $('#user_firstName').val(result['data']['personnel'][0]['firstName']);
                $('#user_lastName').val(result['data']['personnel'][0]['lastName']);
                //$('#user_department').val(result['data']['personnel'][0]['departmentID']);
                $('#user_jobTitle').val(result['data']['personnel'][0]['jobTitle']);
                $('#user_email').val(result['data']['personnel'][0]['email']);

            }

            else {
                $('#userSelectModalLabel').html(`${result['data']['personnel'][0]['firstName']} ${result['data']['personnel'][0]['lastName']}`);
                //$('#user_id').val(result['data']['personnel'][0]['id']);
                $('#user_firstName').val(result['data']['personnel'][0]['firstName']);
                $('#user_lastName').val(result['data']['personnel'][0]['lastName']);
                //$('#user_department').val(result['data']['personnel'][0]['departmentID']);
                $('#user_jobTitle').val(result['data']['personnel'][0]['jobTitle'] = "Not Available");
                $('#user_email').val(result['data']['personnel'][0]['email']);

            }

            $('#userSelectModal').modal('show');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });
};


//**DELETING PERSONNEL**//Getting a personnel's details by ID for deleting
function deletepersonnelbyId(deleteId) {

    $('#confirmDeletion').modal('show');

        $.ajax({
            url: "./php/getPersonnelByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: deleteId,
            },
            success: function (result) {
                //console.log(result, "delete personnel")

                $('#confirmPersonnelName').html('Are you sure you would like to delete <b>' + result['data']['personnel'][0]['lastName']+ ', '
                + result['data']['personnel'][0]['firstName'] + '</b>?'); 
                $('#confirmDeletionButton').val(result['data']['personnel'][0]['id']);
                //console.log(result['data']['personnel'][0]['id']);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                console.log(jqXHR, errorThrown);
            },
        });
    
};

//**DELETING PERSONNEL**//Deleting a personnel by ID

    $('#confirmDeletionButton').on('click', event => {

        $.ajax({
            url: "./php/deletePersonnelByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: $('#confirmDeletionButton').val(),
            },
            success: function (result) {
                //console.log(result, "confirm delete personnel")
                $('#confirmDeletion').modal('hide');

                populatePersonnelTable();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                console.log(jqXHR, errorThrown);
            },
        });
    })


//**UPDATING PERSONNEL**//Getting a personnel's details by ID for updating

function editpersonnelbyId(editId) {

    $('#editEmployee').modal('show');

    $.ajax({
        url: "./php/getPersonnelByID.php",
        type: 'get',
        dataType: 'json',
        data: {
            id: editId,
        },
        success: function (results) {

            const data = results["data"]

            $('#editEmployeeId').val(data.personnel['0'].id);
            

            $('#editEmployeeFirstName').val(data.personnel['0'].firstName);
            $('#editEmployeeLastName').val(data.personnel['0'].lastName);
            $('#editEmployeeEmail').val(data.personnel['0'].email);
            $('#editEmployeeJobTitle').val(data.personnel['0'].jobTitle);
            $('#editEmployeeDepartment').val(data.personnel['0'].departmentID);
            $('#editEmployeeLocation').val(data.personnel['0'].location);
            
            //console.log(results, "update personnel")



            populateDepartmentlist();
            populatePersonnelTable();



        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

};


$('#confirmUpdateButton').on('click', event => {
    $('#confirmUpdate').modal('hide');
})

//**UPDATING PERSONNEL**//Confirming updating a personnel by id

$('#Update-btn').on('click', event => {
    $('#editEmployee').modal('hide');


    $.ajax({
        url: "./php/updatePersonnelByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            firstName: $('#editEmployeeFirstName').val(),
            lastName: $('#editEmployeeLastName').val(),
            email: $('#editEmployeeEmail').val(),
            jobTitle: $('#editEmployeeJobTitle').val(),
            departmentID: $('#editEmployeeDepartment').val(),
            id: $('#editEmployeeId').val(),
        },
        success: function (result) {
            //console.log(result, "confirm edit personnel")
            $("#feedback-title").text("Update successful.")
            $("#feedback-message").text("Personnel update has been successful")
            $('#confirmUpdate').modal('show')

            /*$('#confirmUpdateButton').on('click', event => {
                $('#confirmUpdate').modal('hide');
                populatePersonnelTable()
            })*/
            populatePersonnelTable()

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });
})


//**DELETING DEPARTMENT**//Getting personnel dependencies for DELETING department by ID
function departmentdependencies(id) {


    $.ajax({
        url: "./php/getDepartmentDependencies.php",
        type: 'GET',
        dataType: 'json',
        data: {
            id,
        },
        success: function (result) {
            //console.log(result, "department dependencies")

            if (result.data[0].departmentCount == 0) {

                $('#departmentDeletionButton').val(id);
                $('#departmentDeletion').modal('show');
                $('#confirmDepartmentName').text(result['data'][0]['departmentName']); 
            } else {
                $('#nodepartmentDeletion').modal('show');
                $('#confirmDepartmentCount').text(result['data'][0]['departmentName']); 
                $("#pc").text(result['data'][0]['departmentCount']);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

};

//**DELETING DEPARTMENT**//Confirming deleting a department by ID
//function deletedepartmentbyId() {
$('#departmentDeletionButton').on('click', event => {

    /*$('#departmentDeletionButton').on('click', event => {
        console.log($('#departmentDeletionButton').val())*/

    //console.log($('#departmentDeletionButton').val());

    $.ajax({
        url: "./php/deleteDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: $('#departmentDeletionButton').val()
        },
        success: function (result) {
            //console.log(result, "delete department")
            $('#departmentDeletion').modal('hide');

            populateDepartmentTable();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });
    //})

})


//**DELETING LOCATION**//Getting department dependencies for DELETING location by ID
function locationdependencies(id) {

    $.ajax({
        url: "./php/getLocationDependencies.php",
        type: 'GET',
        dataType: 'json',
        data: {
            id,
        },
        success: function (result) {
            //console.log(result, "location dependencies")

            if (result.data[0].locationCount == 0) {
                $('#locationDeletionButton').val(id);
                $('#locationDeletion').modal('show');
                $('#confirmLocationName').text(result['data'][0]['locationName']); 
            } else {
                $('#nolocationDeletion').modal('show');
                $('#confirmLocationCount').text(result['data'][0]['locationName']); 
                $("#lc").text(result['data'][0]['locationCount']);
            }
            //console.log($('#locationDeletionButton').val());
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

};

//**DELETING LOCATION**//Confirming deleting a location by ID
$('#locationDeletionButton').on('click', event => {

    //console.log($('#locationDeletionButton').val());

    $.ajax({
        url: "./php/deleteLocationByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: $('#locationDeletionButton').val()
        },
        success: function (result) {
            //console.log(result, "delete location")
            $('#locationDeletion').modal('hide');

            populateLocationTable();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });

})

//**UPDATING DEPARTMENT**//Getting a department's details by ID for updating
function editdepartmentbyId(depId) {

    $('#editDepartment').modal('show');
    populateLocationlist()

    $.ajax({
        type: "GET",
        url: "./php/getDepartmentByID.php",
        data: {
            id: depId,
        },
        success: function (result) {

            $('#editDepartmentId').val(result['data'][0]['id']);

            $('#editDepartmentName').val(result['data'][0]['name']);
            $('#editDepartmentLocationSelect').val(result['data'][0]['locationID']);
            


            //console.log(result, "update department")

            populateDepartmentTable();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });
}

//**UPDATING DEPARTMENT**//Confirming updating department by ID

$('#depUpdate-btn').on('click', event => {
    $('#editDepartment').modal('hide');


    $.ajax({
        url: "./php/updateDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            name: $('#editDepartmentName').val(),
            locationID: $('#editDepartmentLocationSelect').val(),
            id: $('#editDepartmentId').val(),
        },
        success: function (result) {
            //console.log(result, "confirm update department")
            $("#feedback-title").text("Update successful.")
            $("#feedback-message").text("Department update has been successful")
            $('#confirmUpdate').modal('show')
            /*('#confirmUpdateButton').on('click', event => {
                $('#confirmUpdate').modal('hide');
            })*/

            populateDepartmentTable()

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });
})

///**UPDATING LOCATION**//Getting a locations's details by ID for updating
function editlocationbyId(locId) {

    $('#editLocation').modal('show');


    $.ajax({
        type: "GET",
        url: "./php/getLocationByID.php",
        data: {
            id: locId,
        },
        success: function (result) {

            $('#editLocationId').val(result['data'][0]['id'])

            $('#editLocationName').val(result['data'][0]['name']);
           



            //console.log(result, "update location")
            populateLocationTable()

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });
}

//**UPDATING LOCATION**//Confirming updating location by ID

$('#locUpdate-btn').on('click', event => {
    $('#editLocation').modal('hide');


    $.ajax({
        url: "./php/updateLocationByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            name: $('#editLocationName').val(),
            id: $('#editLocationId').val(),
        },
        success: function (result) {
            //console.log(result, "confirm update location")
            $("#feedback-title").text("Update successful.")
            $("#feedback-message").text("Location update has been successful")
            $('#confirmUpdate').modal('show')

            /*('#confirmUpdateButton').on('click', event => {
                $('#confirmUpdate').modal('hide');
            })*/

            populateLocationTable()
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });


})

//SEARCH BY NAME/DEPARTMENT/LOCATION
$('#searchPersonnel').on('click', event => {
    event.preventDefault();

    $.ajax({
        url: "./php/searchBy.php",
        type: 'GET',
        dataType: 'json',
        data: {
            department: $('#searchBy').val(),
            location: $('#searchBy').val(),
            lastName: $('#searchBy').val(),
            firstName: $('#searchBy').val(),
        },
        success: function (result) {
            //console.log(result, 'search')
            let data = result["data"];
            let tr = ``;


            for (let i = 0; i < data.length; i++) {
                tr += `<tr>
                <td>${data[i].lastName + ',' + data[i].firstName}</td> 
                <td class="d-none d-md-table-cell">${data[i].department}</td> 
                <td class="d-none d-md-table-cell">${data[i].location}</td>
                <td> <button onclick="viewpersonnelbyid('${data[i].id}')" class="btn btn fa  fa-eye custom-button"></button></td> 
                <td> <button onclick="deletepersonnelbyId('${data[i].id}')" class="btn btn fa  fa-trash custom-button"></button></td> 
                <td> <button onclick="editpersonnelbyId('${data[i].id}')"class="btn btn fa  fa-pen custom-button"></button></td>
               
                </tr>`;
            };

            $('#personnel-table-body').html(tr);
            $('#Navpersonnel').click();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown);
        },
    });
})



