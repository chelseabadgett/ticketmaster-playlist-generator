import SpotifyApi from "./apiClients/spotifyApi";
import TicketmasterApi from "./apiClients/ticketmasterApi";
import { getLatLong } from "./utils/location";
import {
	getSpotifyUserDetails,
	getSpotifyUsersTopTrackIds,
	getSpotifyTopSongRecommendationsForArtist,
	redirectToAuthCodeFlow,
} from "./utils/spotify";
import { getRecommendedConcertsDetails } from "./utils/ticketmaster";

const updateRecommendationHtml = async (concert, externalUrls) => {
	const htmlEmbedPromises = externalUrls.map(async (url) => {
		return await SpotifyApi.getEmbed(url);
	});

	const htmlEmbeds = (await Promise.all(htmlEmbedPromises)).map(
		(item) => item.html
	);

	const parentElement = document.querySelector(".main");

	const eventDiv = document.createElement("div");
	eventDiv.classList.add("event");
	parentElement.appendChild(eventDiv);

	// create HTML for concert info
	const concertInfoDiv = document.createElement("div");
	concertInfoDiv.classList.add("concert-info");

	const concertDate = new Date(concert.eventDate);
	const concertDayName = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
	}).format(concertDate);

	const concertMonthName = new Intl.DateTimeFormat("en-US", {
		month: "short",
	})
		.format(concertDate)
		.toUpperCase();
	const concertDayOfMonth = concertDate.getDate();

	const hours = concertDate.getHours().toString().padStart(2, "0");
	const minutes = concertDate.getMinutes().toString().padStart(2, "0");
	const concertTime = `${hours}:${minutes}`;

	const concertInfoHtml = `
      <div class="col-1">
        <div class="date">
          <div class="month">${concertMonthName}</div>
          <div class="day">${concertDayOfMonth}</div>
        </div>
      </div>
      <div class="col-2">
        <div class="details">
          <div class="day-and-time">${concertDayName} | ${concertTime}</div>
          <div class="event-name"><b>${concert.eventName}</b></div>
          <div class="venue-name">${concert.venueName}</div>
        </div>
        <div class="ticketmaster-link">
          <a href="${concert.url}" target="_blank" rel="noopener noreferrer">Purchase Tickets <i class="fas fa-external-link-alt"></i></a>
        </div>
      </div>
  `;
	concertInfoDiv.innerHTML = concertInfoHtml;
	eventDiv.appendChild(concertInfoDiv);

	// create HTML for spotify embeds
	const spotifyEmbedsDiv = document.createElement("div");
	spotifyEmbedsDiv.classList.add("spotify-embeds");
	eventDiv.appendChild(spotifyEmbedsDiv);

	htmlEmbeds.forEach((htmlEmbed) => {
		const htmlEmbedDiv = document.createElement("div");
		htmlEmbedDiv.innerHTML = htmlEmbed;
		spotifyEmbedsDiv.appendChild(htmlEmbedDiv);
	});
};

const updateHeaderHtml = (displayName) => {
	if (displayName) {
		const headerParagraph = document.querySelector(`h1`);
		headerParagraph.innerHTML = `👋 Hello, ${displayName}.`;
	}
};

const setupBrowserSpotifyAuth = async (spotifyAuthorizationCode) => {
	const spotifyAppClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

	if (!spotifyAuthorizationCode) {
		localStorage.removeItem("spotify_access_token");
		redirectToAuthCodeFlow(spotifyAppClientId);
	} else {
		let spotifyAccessToken = localStorage.getItem("spotify_access_token");
		const spotifyVerifier = localStorage.getItem("verifier");

		if (!spotifyAccessToken) {
			let spotifyAccessToken = await SpotifyApi.getAccessToken(
				spotifyAppClientId,
				spotifyAuthorizationCode,
				spotifyVerifier
			);

			localStorage.setItem("spotify_access_token", spotifyAccessToken);

			return spotifyAccessToken;
		}
		return spotifyAccessToken;
	}
};

const runRecommenderAndUpdateUI = async () => {
	const urlSearchQueryParams = new URLSearchParams(window.location.search);
	const spotifyAuthorizationCode = urlSearchQueryParams.get("code");

	const spotifyAccessToken = await setupBrowserSpotifyAuth(
		spotifyAuthorizationCode
	);

	const user = await getSpotifyUserDetails(spotifyAccessToken);

	updateHeaderHtml(user.displayName);

	let usersTopTrackIds = await getSpotifyUsersTopTrackIds(spotifyAccessToken);
	console.log(`!usersTopTrackIds`, usersTopTrackIds);

	const userLocation = await getLatLong();
	console.log(`!userLocation`, userLocation);
	const recommendedConcertsResponse =
		await TicketmasterApi.getRecommendedConcertsForLocation(userLocation);

	const recommendedConcerts = getRecommendedConcertsDetails(
		recommendedConcertsResponse._embedded.events
	);

	for (let concert of recommendedConcerts) {
		let recommendedTracks = await getSpotifyTopSongRecommendationsForArtist(
			usersTopTrackIds,
			concert.artistName,
			spotifyAccessToken
		);

		if (recommendedTracks.length >= 3) {
			let externalUrls = recommendedTracks.map((item) => item.externalUrl);
			await updateRecommendationHtml(concert, externalUrls);
			console.log(`rec tracks`, recommendedTracks);
		}
	}
	console.log(`recommendedConcerts`, recommendedConcerts);
};

runRecommenderAndUpdateUI();
