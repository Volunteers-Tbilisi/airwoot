import * as contactModel from "./models/contact.js";

const handleWebhook = async (payload) => {
	const event = payload.event;

	switch (event) {
		case "contact_created": {
			createContact(payload);
			break;
		}
		case "contact_updated":
			break;
		default:
			throw { message: `Unexpected type of event: ${event}`, statusCode: 501 };
	}
};

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
	// create if it doesn't exsist
	try {
		contactRecord ??= await contactModel.createContact({ name, phone, tg, wa });
	} catch (err) {
		console.error(err);
	}

	// view it in a chatwoot
	const account_id = body.account.id;
	const contact_id = body.id;
	await contactModel.fillContactAttr("Airtable", contactRecord.id, true, {
		account_id,
		contact_id,
	});
}

export default handleWebhook;
