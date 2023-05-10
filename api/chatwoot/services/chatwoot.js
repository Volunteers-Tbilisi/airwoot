import dotenv from "dotenv";

dotenv.config();
const TOKEN = process.env.CHATWOOT_TOKEN;
const BASE_URL = process.env.CHATWOOT_API_URL;

async function updateContactAttr(data, ids) {
	const url = getContactUrl(ids);
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
	const url = getContactUrl(ids);
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			api_access_token: TOKEN,
		},
	});
	const data = await res.json();
	console.log("look here");

	console.log(data);
	return data;
}

async function sendMsg(data, ids) {
	const url = getConversationUrl(ids);
	await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			api_access_token: TOKEN,
		},
		body: JSON.stringify(data),
	});
}

function getContactUrl(ids) {
	const { account_id, contact_id } = ids;
	const url = `${BASE_URL}/accounts/${account_id}/contacts/${contact_id}`;
	return url;
}

function getConversationUrl(ids) {
	const { account_id, contact_id } = ids;
	// 											/accounts/{account_id}/conversations/{conversation_id}/messages

	const url = `${BASE_URL}/accounts/${account_id}/conversations/${contact_id}/messages`;
	return url;
}

export { updateContactAttr, getContactAttr, sendMsg };
