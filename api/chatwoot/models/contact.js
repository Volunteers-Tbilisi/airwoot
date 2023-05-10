import dotenv from "dotenv";
import * as airtable from "../services/airtable.js";
import * as chatwoot from "../services/chatwoot.js";

dotenv.config();
const tableId = process.env.TABLE_CONTACTS;
const viewId = process.env.VIEW_CONTACTS_DEFAULT;

const tableFieldNames = new Map([
	["name", "Имя"],
	["phone", "Номер телефона"],
	["tg", "Telegram nickname"],
	["wa", "What'sApp"],
	["tickets", "Обращения"],
	["identifier", "Telegram id"],
]);

async function createContact(obj) {
	const fields = {};
	tableFieldNames.forEach((tableKey, objKey) => {
		fields[tableKey] = obj[objKey];
	});

	const newContact = await airtable.createRecord(tableId, fields);
	return newContact;
}

async function getContactCard(body) {
	const contactId = await getContactId(body);
	const contactCard = await airtable.findRecord(tableId, contactId);
	const key = tableFieldNames.get("tickets");
	return { contactCard, key };
}

async function getContacts() {
	const records = await airtable.getRecords(tableId, (record) => {
		const obj = {};
		obj.id = record.id;
		tableFieldNames.forEach((tableKey, objKey) => {
			obj[objKey] = record.fields[tableKey];
		});
		return obj;
	});
	return records;
}

async function fillContactAttr(attr, value, custom = true, ids) {
	if (attr === "airtable") {
		value = airtable.serializeUrl(tableId, viewId, value);
	}
	if (custom) {
		value = { custom_attributes: { [attr]: value } };
	}
	await chatwoot.updateContactAttr(value, ids);
}

async function getContactAttr(ids) {
	const res = await chatwoot.getContactAttr(ids);
	const contactUrl = res.payload.custom_attributes.airtable;
	return contactUrl;
}

async function getContactId(body) {
	let account_id;
	let contact_id;
	if (body.event === "conversation_status_changed") {
		account_id = body.messages[0].account_id;
		contact_id = body.id;
	}
	account_id ??= body.account.id;
	contact_id ??= body.conversation.id;
	const ids = { account_id, contact_id };
	const url = await getContactAttr(ids);
	const id = url.split("/")[6].split("?")[0];
	return id;
}

export { createContact, getContactCard, getContacts, fillContactAttr, getContactAttr };
