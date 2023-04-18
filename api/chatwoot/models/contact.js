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

async function updateContact() {
	console.log("Contact have been updated");
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
	if (attr === "Airtable") {
		value = airtable.serializeURL(tableId, viewId, value);
	}
	if (custom) {
		value = { custom_attributes: { [attr]: value } };
	}
	await chatwoot.updateAttr(value, ids);
}

export { createContact, updateContact, getContacts, fillContactAttr };
