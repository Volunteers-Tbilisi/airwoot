import dotenv from "dotenv";

dotenv.config();
const TOKEN = process.env.CHATWOOT_TOKEN;
const BASE_URL = process.env.CHATWOOT_API_URL;

async function updateAttr(data, ids) {
	const { account_id, contact_id } = ids;
	const url = `${BASE_URL}/accounts/${account_id}/contacts/${contact_id}`;
	console.log(url);
	await fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			api_access_token: TOKEN,
		},
		body: JSON.stringify(data),
	});
}

export { updateAttr };
