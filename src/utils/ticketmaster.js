export const getRecommendedConcertsDetails = (ticketmasterEvents) => {
	return ticketmasterEvents
		.map((event) => {
			if (!event._embedded.venues || !event._embedded.attractions) {
				return null;
			}

			return {
				eventName: event.name,
				venueName: event._embedded.venues[0].name, // First venue name
				artistName: event._embedded.attractions[0].name, // First attraction name
				eventDate: event.dates.start.dateTime, // Concert date
				url: event.url,
			};
		})
		.filter((item) => item !== null);
};
