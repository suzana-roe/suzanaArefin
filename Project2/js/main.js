$(document).ready(function () {
    populatePersonnelTable();
    populateDepartmentTable();
    populateLocationTable();

});

let activedepartment;

//Generating Personnel Table 
function populatePersonnelTable() {
    $.ajax({
        url: "./php/getAll.php",
        type: 'GET',
        dataType: 'json',
        success: function (results) {

            let data = results["data"];
            let tr = ``;
            console.log('populate personnel', data)


            for (let i = 0; i < data.length; i++) {
                tr += `<tr>
                <td>${data[i].id}</td>
                <td>${data[i].lastName}</td>
                <td>${data[i].firstName}</td> 
                <td>${data[i].department}</td> 
                <td>${data[i].location}</td>
                <td> <button onclick="viewpersonnelbyid('${data[i].id}')" class="btn btn fa  fa-eye custom-button"></button> <button onclick="deletepersonnelbyId('${data[i].id}')" class="btn btn fa  fa-trash custom-button"></button> <button onclick="editpersonnelbyId('${data[i].id}')"class="btn btn fa  fa-pen custom-button"></button></td>
                
               
                </tr>`;
            };

            $('#personnel-table-body').html(tr);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
        }
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
            console.log('populate department', data)


            for (let i = 0; i < data.length; i++) {
                tr += `<tr>
                <td>${data[i].id}</td>
                <td>${data[i].name}</td>
                <td>${data[i].location}</td>
                <td><button  data-id="${data[i].id}"  onclick="departmentdependencies('${data[i].id}')" class="btn btn fa  fa-trash custom-button"></button> <button onclick="editdepartmentbyId('${data[i].id}')"class="btn btn fa  fa-pen custom-button"></button></td>

                    </tr>`;


            };

            $('#department-table-body').html(tr);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
        }
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
            console.log('populate location', data)


            for (let i = 0; i < data.length; i++) {
                tr += `<tr>
                <td>${data[i].id}</td>
                <td>${data[i].location}</td>
                <td><button data-id="${data[i].id}" onclick="locationdependencies('${data[i].id}')" class="btn btn fa  fa-trash custom-button"></button> <button onclick="editlocationbyId('${data[i].id}')"class="btn btn fa  fa-pen custom-button"></button></td>

                    </tr>`;
            };

            $('#location-table-body').html(tr);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
        }
    });

}

//Generating Department list for add personnel modal
function populateDepartmentlist() {

    $.ajax({
        url: "./php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            console.log(result, 'department list')

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
        },
    });

}

$("#add-btn").click(function () {
    populateDepartmentlist()
});



//Generating Location list for add personnel and add department modals
function populateLocationlist() {

    $.ajax({
        url: "./php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            console.log(result, 'location list')

            if (result.status.name == "ok") {
                for (var i = 0; i < result.data.length; i++) {
                    $("#addEmployeeLocation").append(
                        $("<option>", {
                            text: result.data[i].location,
                            value: result.data[i].id,

                        })
                    );
                    $("#locationSelectForAddDept").append(
                        $("<option>", {
                            text: result.data[i].location,
                            value: result.data[i].id,

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
        },
    });

}

$("#add-btn").click(function () {
    populateLocationlist()
});

$("#add-department").click(function () {
    populateLocationlist()
});


//CRUD OPERATORS//CREATE

//Adding new personnel to database via modal

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
            console.log(status, 'add new personnel');

            populatePersonnelTable();
            $('#add-modal').modal("hide");
        }

    });

});

//Adding new location to database via modal

$("#loc-submit-btn").click(function () {


    $.ajax({
        url: "./php/insertLocation.php",
        type: 'POST',
        dataType: 'json',
        data: {

            name: $('#addLocationName').val(),

        },
        success: function (data, status) {
            console.log(status, 'add new location');

            populateLocationTable();
            $('#add-locmodal').modal("hide");
        }

    });

});

//Adding new department to database via modal

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
            console.log(status, 'add new location');

            populateDepartmentTable();

        }

    });

});


//Getting department by id

function viewdepartmentbyid(depId) {

    $.ajax({
        type: "POST",
        url: "./php/getDepartmentByID.php",
        data: {
            id: depId,
        },
        success: function (result) {
            console.log(result, "department")



        },
        error: function (result) {
            alert('error');
        }
    });
};

//Getting specific personnel details by id

function viewpersonnelbyid(personnelId) {


    $.ajax({
        type: "POST",
        url: "./php/getPersonnelByID.php",
        data: {
            id: personnelId,
        },
        success: function (result) {
            console.log(result, "specific personnel")





            $('#userSelectModalLabel').html(`${result['data']['personnel'][0]['firstName']} ${result['data']['personnel'][0]['lastName']}`);
            $('#user_id').val(result['data']['personnel'][0]['id']);
            $('#user_firstName').val(result['data']['personnel'][0]['firstName']);
            $('#user_lastName').val(result['data']['personnel'][0]['lastName']);
            $('#user_department').val(result['data']['personnel'][0]['departmentID']);
            $('#user_email').val(result['data']['personnel'][0]['email']);



            $('#userSelectModal').modal('show');

        },
        error: function (result) {
            alert('error');
        }
    });
};

//DELETE //Deleting a personnel by ID
function deletepersonnelbyId(deleteId) {

    $('#confirmDeletion').modal('show');

    $('#confirmDeletionButton').on('click', event => {


        $.ajax({
            url: "./php/deletePersonnelbyID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: deleteId,
            },
            success: function (result) {
                console.log(result, "delete personnel")
                $('#confirmDeletion').modal('hide');

                populatePersonnelTable();

            },
            error: function (result) {
                alert('error');
            }
        });
    })
};

//UPDATE //Getting a personnel's details by ID for editing

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
            const returned_user = data.personnel['0'];

            $('#editEmployeeFirstName').val(returned_user.firstName);
            $('#editEmployeeLastName').val(returned_user.lastName);
            $('#editEmployeeEmail').val(returned_user.email);
            $('#editEmployeeJobTitle').val(returned_user.jobTitle);
            $('#editEmployeeDepartment').html(returned_user.departmentID);
            $('#editEmployeeLocation').html(returned_user.location);
            $("#Update-btn").attr("userID", returned_user.id);
            console.log(results, "update personnel")



            populateDepartmentlist();
            populatePersonnelTable();



        },
        error: function (results) {
            alert('error');
        }
    });

};



//UPDATE //Confirming edit personnel

$('#Update-btn').on('click', event => {
    $('#editEmployee').modal('hide');
    $('#confirmUpdate').modal('show');


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
            id: $("#Update-btn").attr("userID")
        },
        success: function (result) {
            console.log(result, "confirm edit personnel")

            $('#confirmUpdateButton').on('click', event => {
                $('#confirmUpdate').modal('hide');
                populatePersonnelTable()
            })

        },
        error: function (result) {
            alert('error');
        }
    });
})


//DELETE //Getting personnel dependencies for department by ID
function departmentdependencies(id) {


    $.ajax({
        url: "./php/getDepartmentDependenciesByID.php",
        type: 'GET',
        dataType: 'json',
        data: {
            id,
        },
        success: function (result) {
            console.log(result, "department dependencies")

                if (result.data[0].employees == 0) {

                    $('#departmentDeletionButton').val(id);
                    $('#departmentDeletion').modal('show');
                } else {
                    $('#nodepartmentDeletion').modal('show');
                }

        },
        error: function (result) {
            alert('error');
        }
    });

};

//DELETE //Deleting a department by ID
function deletedepartmentbyId() {

    /*$('#departmentDeletionButton').on('click', event => {
        console.log($('#departmentDeletionButton').val())*/

        console.log($('#departmentDeletionButton').val());
        
        $.ajax({
            url: "./php/deleteDepartmentByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: $('#departmentDeletionButton').val()
            },
            success: function (result) {
                console.log(result, "delete department")
                $('#departmentDeletion').modal('hide');

                populateDepartmentTable();

            },
            error: function (result) {
                alert('error');
            }
        });
    //})

};

//UPDATE // UPDATE DEPARTMENT BY ID
function editdepartmentbyId(depId) {

    $('#editDepartment').modal('show');

    $.ajax({
        type: "GET",
        url: "./php/getDepartmentByID.php",
        data: {
            id: depId,
        },
        success: function (result) {

            $('#editDepartmentName').val(result['data'][0]['name']);
            $('#editDepartmentLocationSelect').val(result['data'][0]['locationID']);
            $('#depUpdate-btn').val(result['data'][0]['id']);


            console.log(result, "update department")

            populateDepartmentTable();

        },
        error: function (result) {
            alert('error');
        }
    });
}

//UPDATE //Confirming edit department

$('#depUpdate-btn').on('click', event => {
    $('#editDepartment').modal('hide');
    $('#confirmUpdate').modal('show');

    $.ajax({
        url: "./php/updateDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            name: $('#editDepartmentName').val(),
            locationID: $('#editDepartmentLocationSelect').val(),
            id: $('#depUpdate-btn').val(),
        },
        success: function (result) {
            console.log(result, "confirm update department")

                ('#confirmUpdateButton').on('click', event => {
                    $('#confirmUpdate').modal('hide');
                })

        },
        error: function (result) {
            alert('error');
        }
    });
})



//UPDATE // UPDATE location BY ID
function editlocationbyId(locId) {

    $('#editLocation').modal('show');


    $.ajax({
        type: "GET",
        url: "./php/getLocationByID.php",
        data: {
            id: locId,
        },
        success: function (result) {

            $('#editLocationName').val(result['data'][0]['name']);


            console.log(result, "update location")

        },
        error: function (result) {
            alert('error');
        }
    });
}

//UPDATE //CONFIRM UPDATE LOCATION BY ID

$('#locUpdate-btn').on('click', event => {
    $('#confirmUpdate').modal('show');

    $.ajax({
        url: "./php/updateLocationByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            name: $('#editLocationName').val(),
            id: $('#Update-btn').val(),
        },
        success: function (result) {
            console.log(result, "confirm update location")

                ('#confirmUpdateButton').on('click', event => {
                    $('#confirmUpdate').modal('hide');
                })

        },
        error: function (result) {
            alert('error');
        }
    });


})

//DELETE //Getting department dependencies for location by ID
function locationdependencies(id) {

    $.ajax({
        url: "./php/getLocationDependencies.php",
        type: 'GET',
        dataType: 'json',
        data: {
            id,
        },
        success: function (result) {
            console.log(result, "location dependencies")

                if (result.data[0].departments == 0) {
                    $('#locationDeletionButton').val(id);
                    $('#locationDeletion').modal('show');
                } else {
                    $('#nolocationDeletion').modal('show');
                }
                console.log($('#locationDeletionButton').val());
        },
        error: function (result) {
            alert('error');
        }
    });

};

//DELETE //Deleting a location by ID
function deletelocationbyId() {

    console.log($('#locationDeletionButton').val());

        $.ajax({
            url: "./php/deleteLocationByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: $('#locationDeletionButton').val()
            },
            success: function (result) {
                console.log(result, "delete location")
                $('#locationDeletion').modal('hide');

                populateLocationTable();

            },
            error: function (result) {
                alert('error');
            }
        });

};

function searchPersonal(event) {
    event.preventDefault();
    
    $.ajax({
        url: "./php/search.php",
        type: 'GET',
        dataType: 'json',
        data: {
            department: $('#searchByDepartment').val(),
            location: $('#searchByLocation').val(),
        },
        success: function(result) {
            console.log(result, 'search')
            populatePersonnelTable();
            $('#Navpersonnel').click();
 
            
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error');
        }
    });
}