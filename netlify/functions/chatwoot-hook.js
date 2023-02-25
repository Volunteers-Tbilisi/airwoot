import getPersonId from "./helpers/getPersonId";
import postTicket from "./helpers/postTicket";
import formatTicketUrl from "./helpers/formatTicketUrl";
import formattedReturn from "./helpers/formattedReturn";
import createMessage from "./helpers/createMessage";

export const handler = async (event, context) => {
	const body = JSON.parse(event.body);

	// grab a sender credentials
	const sender = body.meta.sender;
	const username = sender.additional_attributes.username;
	const name = sender.name;
	const phone_number = sender.phone_number;
	const date = body.contact_inbox.created_at.split('').slice(0, 10).join('');

	// grab inbox identifiers
	const account_id = body.messages[0].account_id;
	const conversation_id = body.messages[0].conversation_id;

	let personId = await getPersonId({username, name, phone_number});
	personId = JSON.parse(personId.body);

	// TODO add a ticket topic and type for a ticket
	// TODO add a source of a request depending from which bot it comes

	// generate a ticket for a request

	let ticketId = await postTicket({username, phone_number, personId, date});
	ticketId = JSON.parse(ticketId.body);

	let ticketURL = await formatTicketUrl(ticketId);
	ticketURL = JSON.parse(ticketURL.body);

	await createMessage({account_id, conversation_id, ticketURL});
	
	return formattedReturn(201, ticketURL);
};