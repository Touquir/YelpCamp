require("dotenv").config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

geocodingClient
	.forwardGeocode({
		query: 'paris, France',
		limit:
	})
	.send()
	.then(response=>{
		const match=response.body;
		console.log(match);
	});