import { decode } from "html-entities";
import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { SearchItem } from "~/utils/types";

const runtimeConfig = useRuntimeConfig();
const sdk = SpotifyApi.withClientCredentials(
	runtimeConfig.spotify.clientId,
	runtimeConfig.spotify.clientSecret,
);

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const search = query.search;

	if (!search || Array.isArray(search) || typeof search !== "string") {
		throw createError({
			message: "No search term provided",
			status: 400,
		});
	}

	if (search.length > 50) {
		throw createError({
			message: "Search longer than 50 characters",
			status: 400,
		});
	}

	const items = await sdk.search(search, ["track"]);

	const data: SearchItem[] = items.tracks.items.map((i: Track) => ({
		id: i.id,
		title: i.name,
		artist: i.artists.map((a) => a.name).join(", "),
		album: i.album.name,
		albumImageUrl: i.album.images[0].url,
	}));

	return data;
});

async function queryYoutube(search: string) {
	const runtimeConfig = useRuntimeConfig();
	const up = new URLSearchParams();
	up.append("part", "id,snippet");
	up.append("q", decodeURIComponent(search));
	up.append("type", "video");
	up.append("key", runtimeConfig.youtubeApiKey);

	const url = "https://www.googleapis.com/youtube/v3/search?" + up.toString();

	console.log(url);
	const res = await fetch(url);
	if (!res.ok) {
		console.error(`Failed to query youtube: ${res.status} ${res.statusText}`);
		throw new Error(`Failed to query youtube: ${res.status} ${res.statusText}`);
	}

	const data: YoutubeResponse = await res.json();

	if (!data.items || data.items.length === 0) {
		return [];
	}

	return data.items.map((i) => ({
		id: i.id.videoId,
		title: decode(i.snippet.title),
		thumbnailUrl: i.snippet.thumbnails.default.url,
		thumbnailLgUrl: i.snippet.thumbnails.high.url,
	}));
}

type YoutubeResponse = {
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: Array<{
		kind: string;
		etag: string;
		id: {
			kind: string;
			videoId: string;
		};
		snippet: {
			publishedAt: string;
			channelId: string;
			title: string;
			description: string;
			thumbnails: {
				default: {
					url: string;
					width: 120;
					height: 90;
				};
				medium: {
					url: string;
					width: 320;
					height: 180;
				};
				high: {
					url: string;
					width: 480;
					height: 360;
				};
			};
			channelTitle: string;
			liveBroadcastContent: string;
			publishTime: string;
		};
	}>;
};
