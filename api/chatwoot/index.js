import * as contactModel from "./models/contact.js";
import * as ticketModel from "./models/ticket.js";
import * as operatorModel from "./models/operator.js";
import * as view from "./views/main.js";

const handleWebhook = async (payload) => {
	const event = payload.event;
	switch (event) {
		case "contact_created": {
			await initConversation(payload);
			break;
		}
		case "contact_updated":
			// updateContact(payload);
			break;
		case "message_updated":
			if (payload.message_type === "outgoing") {
				await updateAssignee(payload);
			}
			break;
		default:
			throw { message: `Unexpected type of event: ${event}`, statusCode: 501 };
	}
};

async function initConversation(body) {
	const account_id = body.account.id;
	const contact_id = body.id;
	const ids = { account_id, contact_id };

	// find or create contact card in airtable
	const contactRecord = await createContact(body);

	// upd chatwoot contact
	await contactModel.fillContactAttr("airtable", contactRecord.id, true, ids);

	// create ticket in airtable
	const ticket = await createTicket(contactRecord.id);

	// send private msg to chatwoot
	const ticketURL = await ticketModel.getTicketUrl(ticket);
	const contactUrl = await contactModel.getContactAttr(ids);
	await view.sendPrivateMessage(contactUrl, ticketURL, ids);
	console.log("New ticket has been created.");
}

// internal services for handling buisness logic
async function createContact(body) {
	const name = body.name || null;
	const phone = body.phone_number || null;
	const tg = body.additional_attributes.username || null;
	const wa = body.phone_number || null; // TODO check wa hook

	// get a list of contacts
	let contacts = [];
	try {
		contacts = await contactModel.getContacts();
	} catch (err) {
		console.error(err);
	}

	// check if contact does exsist
	let contactRecord = contacts.find(
		(record) => record.phone === phone || record.tg === tg || record.wa === wa
	);
	// TODO fetch person info from exisisting contact card & fill it in
	// create if it doesn't exsist
	try {
		contactRecord ??= await contactModel.createContact({ name, phone, tg, wa });
	} catch (err) {
		console.error(err);
	}

	return contactRecord;
}

async function createTicket(contact) {
	const date = new Date().toLocaleDateString("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone: "Asia/Tbilisi",
	});
	const status = "Новая";
	const name = [];
	name.push(contact);

	try {
		const ticket = await ticketModel.createTicket({ date, name, status });
		return ticket;
	} catch (err) {
		console.error(err);
	}
}

async function updateAssignee(body) {
	// TODO wrap it in a top-level try catch block
	let lastTicketId;
	try {
		lastTicketId = await contactModel.getContactCard(body);
	} catch (err) {
		console.error(err);
	}

	try {
		await ticketModel.updateTicketStatus(lastTicketId, "В работе");
	} catch (err) {
		console.error(err);
	}
	
	const assignee = body.sender.name;
	const assigneeId = await operatorModel.getOperatorId(assignee);
	try {
		await ticketModel.updateAssignee(lastTicketId, assigneeId);
	} catch (err) {
		console.error(err);
	}

	console.log(
		`Ticket status was changed. Ticket was assigned to an operator (ref id: ${assigneeId}).`
	);
}

// async function updateContact(body) {}

export default handleWebhook;
