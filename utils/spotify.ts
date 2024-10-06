type Auth = {
	access_token: string;
};

const baseUrl = "https://api.spotify.com/v1";

export class Spot {
	private auth: Auth;
	private deviceId: string;

	constructor(auth: Auth, deviceId: string) {
		this.auth = auth;
		this.deviceId = deviceId;
	}

	enque(id: string) {
		const params = new URLSearchParams({
			uri: `spotify:track:${id}`,
		});

		return fetch(`${baseUrl}/me/player/queue?${params.toString()}`, {
			headers: {
				Authorization: `Bearer ${this.auth.access_token}`,
			},
		});
	}
}
