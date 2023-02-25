import dotenv from 'dotenv';
import formattedReturn from './formattedReturn';

dotenv.config();

const TOKEN = process.env.CHATWOOT_TOKEN;
const BASE_URL = process.env.CHATWOOT_API_URL;
// const ID = process.env.CHATWOOT_ACCOUNT_ID;

export default async (props) => {	
	const {account_id, conversation_id, ticketURL} = props;
	const url = `${BASE_URL}/accounts/${account_id}/conversations/${conversation_id}/messages`;

	console.log(url);

	const data = {
    "content": `New ticket created in Airtable: ${ticketURL}`,
    "message_type": "outgoing",
    "private": true,
	};

	await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': "application/json; charset=UTF-8",
			'api_access_token': TOKEN,
		},
		body: JSON.stringify(data),
	});

	return formattedReturn(200, {message: 'Ticket has been created.'})
};