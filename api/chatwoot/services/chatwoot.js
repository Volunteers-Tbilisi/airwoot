import dotenv from "dotenv";

dotenv.config();
const TOKEN = process.env.CHATWOOT_TOKEN;
const BASE_URL = process.env.CHATWOOT_API_URL;

async function updateContactAttr(data, ids) {
	const url = serializeContactUrl(ids);
	await fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			api_access_token: TOKEN,
		},
		body: JSON.stringify(data),
	});
}

async function getContactAttr(ids) {
	const url = serializeContactUrl(ids);
	const contact = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			api_access_token: TOKEN,
		},
	});
	return contact;
}

function serializeContactUrl(ids) {
	const { account_id, contact_id } = ids;
	const url = `${BASE_URL}/accounts/${account_id}/contacts/${contact_id}`;
	return url;
}

export { updateContactAttr, getContactAttr };
