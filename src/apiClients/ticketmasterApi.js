const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

// Add Ticketmaster_API_KEY to .env

async function getRecommendedConcertsForLocation(location) {
	const queryParams = {
		apikey: TICKETMASTER_API_KEY,
		classificationName: "music",
		radius: 50,
		sort: "date,asc",
		size: 10,
		latlong: `${location.latitude},${location.longitude}`, // TODO: should be based off of IP
	};

	const queryString = new URLSearchParams(queryParams).toString();

	const url = `https://app.ticketmaster.com/discovery/v2/events.json?${queryString}`;

	const response = await fetch(url, {
		method: "GET",
	});

	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}

	return response.json();
}

export default {
	getRecommendedConcertsForLocation,
};
