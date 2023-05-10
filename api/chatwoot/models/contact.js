import dotenv from "dotenv";
import * as airtable from "../services/airtable.js";
import * as chatwoot from "../services/chatwoot.js";

dotenv.config();
const tableId = process.env.TABLE_CONTACTS;
const viewId = process.env.VIEW_CONTACTS_DEFAULT;

const tableFieldNames = new Map([
	["name", "Имя"],
	["phone", "Номер телефона"],
	["tg", "Telegram"],
	["wa", "What'sApp"],
	["tickets", "Обращения"],
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
	const card = await airtable.findRecord(tableId, contactId);
	const key = tableFieldNames.get('tickets')
	const tickets = card.fields[key];
	return tickets[tickets.length - 1];
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
	const account_id = body.account.id;
	const contact_id = body.conversation.id;
	const ids = { account_id, contact_id };
	const url = await getContactAttr(ids);
	const id = url.split("/")[6].split("?")[0];
	return id;
}

export { createContact, getContactCard, getContacts, fillContactAttr, getContactAttr };
