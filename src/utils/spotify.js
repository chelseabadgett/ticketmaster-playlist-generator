import SpotifyApi from "../apiClients/spotifyApi";

export const getSpotifyUserDetails = async (spotifyAccessToken) => {
	const profile = await SpotifyApi.getUserProfile(spotifyAccessToken);
	return {
		displayName: profile.display_name,
		userId: profile.id,
	};
};

export const getSpotifyUsersTopTrackIds = async (spotifyAccessToken) => {
	const topTracks = await SpotifyApi.getTopTracks(spotifyAccessToken, {
		limit: 4,
	});
	const displayedTracks = topTracks.items.map((item) => {
		return {
			artistName: item.artists[0].name,
			songName: item.name,
		};
	});
	console.log(`toptracks`, displayedTracks);

	return topTracks.items.map((item) => item.id);
};

export const getSpotifyTopSongsForArtist = async (
	artistName,
	spotifyAccessToken
) => {
	const artists = await SpotifyApi.getArtistByName(
		spotifyAccessToken,
		artistName
	);

	const artistId = artists.artists.items[0].id;

	console.log("artists", artists);

	let artistTopTracks = await SpotifyApi.getTopTracksByArtistId(
		spotifyAccessToken,
		artistId
	);

	if (!artistTopTracks.tracks || artistTopTracks.tracks.length === 0) {
		console.warn(`No top tracks found for artist: ${artistName}`);
		return [];
	}

	return artistTopTracks.tracks.slice(0, 3).map((track) => ({
		artistName: track.artists[0].name,
		artistId: track.artists[0].id,
		externalUrl: track.external_urls.spotify,
		songName: track.name,
		id: track.id,
		uri: track.uri,
	}));
};

export async function redirectToAuthCodeFlow(clientId) {
	const verifier = generateCodeVerifier(128);
	const challenge = await generateCodeChallenge(verifier);
	const spotifyRedirectUrl =
		import.meta.env.VITE_SPOTIFY_REDIRECT_URL ||
		import.meta.env.VITE_VERCEL_URL;

	localStorage.setItem("verifier", verifier);

	const params = new URLSearchParams();
	params.append("client_id", clientId);
	params.append("response_type", "code");

	params.append("scope", "user-read-private user-read-email user-top-read");
	params.append("redirect_uri", spotifyRedirectUrl);

	params.append("code_challenge_method", "S256");
	params.append("code_challenge", challenge);

	document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
	let text = "";
	let possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

async function generateCodeChallenge(codeVerifier) {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await window.crypto.subtle.digest("SHA-256", data);
	return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}
