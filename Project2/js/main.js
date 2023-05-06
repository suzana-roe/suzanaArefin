$(document).ready(function () {
    populatePersonnelTable();
    populateDepartmentTable();

});



function populatePersonnelTable() {
    $.ajax({
        url: "./php/getAll.php",
        type: 'GET',
        dataType: 'json',
        success: function (results) {

            let data = results["data"];
            let tr = ``;
            console.log('populate', data)


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






