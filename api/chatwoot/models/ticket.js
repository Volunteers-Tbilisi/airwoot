import dotenv from "dotenv";
import * as airtable from "../services/airtable.js";
import * as chatwoot from "../services/chatwoot.js";

dotenv.config();
const tableId = process.env.TABLE_TICKETS;
const viewId = process.env.VIEW_TICKETS_DEFAULT;

const tableFieldNames = new Map([
	["date", "Дата обращений"],
	["contact", "ФИО"],
	["phone", "Номер телефона"],
	["operator", "Оператор"],
	["status", "Статус"],
]);

async function createTicket(obj) {
	const fields = {};
	tableFieldNames.forEach((tableKey, objKey) => {
		fields[tableKey] = obj[objKey];
	});

	const newTicket = await airtable.createRecord(tableId, fields);
	return newTicket;
}

function getTicketUrl(id) {
	return airtable.serializeUrl(tableId, viewId, id);
}

export { createTicket, getTicketUrl };
