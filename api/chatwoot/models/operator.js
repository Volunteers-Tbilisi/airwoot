import dotenv from "dotenv";
import * as airtable from "../services/airtable.js";

dotenv.config();
const tableId = process.env.TABLE_OPERATORS;

async function getOperatorId(name) {
	const records = await getOperatorsList();
	const record = records.find((record) => {
		if (record.name === name) {
			return record.id;
		}
	});
	return record.id;
}

async function getOperatorsList() {
	const records = await airtable.getRecords(tableId, (record) => {
		const obj = {};
		obj.id = record.id;
		obj.name = record.fields["Имя"];
		return obj;
	});
	return records;
}

export { getOperatorId };
