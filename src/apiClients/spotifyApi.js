async function getUserProfile(accessCode) {
	const result = await fetch(`https://api.spotify.com/v1/me`, {
		headers: { Authorization: `Bearer ${accessCode}` },
	});

	return result.json();
}

async function getTopTracks(accessCode, options) {
	const result = await fetch(
		"https://api.spotify.com/v1/me/top/tracks?" + new URLSearchParams(options),
		{
			method: "GET",
			headers: { Authorization: `Bearer ${accessCode}` },
		}
	);

	return result.json();
}

async function getTracks(accessCode, orderedTrackIds) {
	let trackIdString = orderedTrackIds.toString();
	console.log(`trackidstring: ${trackIdString}`);
	const result = await fetch(
		`https://api.spotify.com/v1/tracks?ids=${trackIdString}`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ${accessCode}` },
		}
	);

	return result.json();
}

async function getArtists(accessCode, allArtistsIds) {
	const artistIdString = allArtistsIds.toString();
	const result = await fetch(
		`https://api.spotify.com/v1/artists?ids=${artistIdString}`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ${accessCode}` },
		}
	);

	return result.json();
}

async function getArtistByName(accessCode, artistName) {
	const result = await fetch(
		`https://api.spotify.com/v1/search?q=${encodeURIComponent(
			artistName
		)}&type=artist&limit=1`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessCode}`,
			},
		}
	);

	return result.json();
}

async function getRecommendationsForArtist(accessCode, trackIds, artistId) {
	const trackIdQueryString = trackIds.toString();
	const seedTracks = encodeURI(trackIdQueryString);
	const result = await fetch(
		`https://api.spotify.com/v1/recommendations?limit=100&seed_artists=${artistId}&seed_tracks=${seedTracks}`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ${accessCode}` },
		}
	);

	return result.json();
}

async function getEmbed(url) {
	const result = await fetch(`https://open.spotify.com/oembed?url=${url}`);

	return result.json();
}

export async function getAccessToken(clientId, authorizationCode, verifier) {
	const spotifyRedirectUrl =
		import.meta.env.VITE_SPOTIFY_REDIRECT_URL ||
		import.meta.env.VITE_VERCEL_URL;

	const params = new URLSearchParams();
	params.append("client_id", clientId);
	params.append("grant_type", "authorization_code");
	params.append("code", authorizationCode);
	params.append("redirect_uri", spotifyRedirectUrl);
	params.append("code_verifier", verifier);

	const result = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params,
	});

	const { access_token } = await result.json();

	return access_token;
}

export default {
	getUserProfile,
	getTopTracks,
	getTracks,
	getArtists,
	getArtistByName,
	getRecommendationsForArtist,
	getEmbed,
	getAccessToken,
};
