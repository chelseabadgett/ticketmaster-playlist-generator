const getUserLocation = () => {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(resolve, reject);
		} else {
			reject(new Error("Geolocation is not supported by this browser."));
		}
	});
};

export const getLatLong = async () => {
	try {
		const position = await getUserLocation();
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		return { latitude, longitude };
	} catch (error) {
		console.error("Error getting location:", error);
	}
};
