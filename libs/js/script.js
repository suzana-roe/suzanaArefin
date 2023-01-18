	/*$('#btnRun1').click(function() {

		$.ajax({
			url: "libs/php/getOcean.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#sellat').val(),
				lng: $('#sellng').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtName').html(result['data'][0]['name']);


				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});*/

	/*$('#btnRun2').click(function() {

		$.ajax({
			url: "libs/php/getAstergdem.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#selLat2').val(),
				lng: $('#selLng2').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtData').html(result['data'][0]['data']);


				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});*/

	$('#btnRun1').click(function() {

		$.ajax({
			url: "libs/php/getfindNearbyWikipedia.php",
			type: 'POST',
			dataType: 'json',
			data: {
				postalcode: $('#selpostalcode').val(),
				country: $('#selcountry').val(),
				radius: $('#selradius').val()
				
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtFeature').html(result['data'][0]['feature']);


				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

	$('#btnRun2').click(function() {

		$.ajax({
			url: "libs/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $('#selCountry').val(),
				lang: $('#selLanguage').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtCapital').html(result['data'][0]['capital']);


				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

	$('#btnRun3').click(function() {

		$.ajax({
			url: "libs/php/getwikipediaSearch.php",
			type: 'POST',
			dataType: 'json',
			data: {
				q: $('#selq').val(),
				
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtSummary').html(result['data'][0]['summary']);


				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

	$('#btnRun4').click(function() {

		$.ajax({
			url: "libs/php/gethierarchy.php",
			type: 'POST',
			dataType: 'json',
			data: {
				geonameId: $('#selgeonameId').val(),
				
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtToponymName').html(result['data'][0]['toponymName']);


				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});