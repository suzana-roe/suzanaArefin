$(document).ready(function () {
    populatePersonnelTable();
    populateDepartmentTable();
    populateLocationTable();

});

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
                tr += `<tr><td>${data[i].lastName}</td>
                <td>${data[i].firstName}</td> 
                <td>${data[i].department}</td> 
                <td>${data[i].location}</td>
               
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
                <td>${data[i].location}</td>

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
$("#add-btn").click(function () {

    $.ajax({
        url: "./php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name == "ok") {
                for (var i = 0; i < result.data.length; i++) {
                    $("#addEmployeeDepartment").append(
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

});

//Generating Location list for add personnel modal
$("#add-btn").click(function () {

    $.ajax({
        url: "./php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name == "ok") {
                for (var i = 0; i < result.data.length; i++) {
                    $("#addEmployeeLocation").append(
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

});

//Generating Location list for add department modal
$("#add-location").click(function () {

    $.ajax({
        url: "./php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name == "ok") {
                for (var i = 0; i < result.data.length; i++) {
                    $("#locationSelectForAddDept").append(
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

});

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
        }

    });

});