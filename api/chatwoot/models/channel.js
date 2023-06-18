import dotenv from "dotenv";
import * as airtable from "../services/airtable.js";

dotenv.config();
const tableId = process.env.TABLE_CHANNELS;

async function getChannelId(name) {
	const records = await getChannelsList();
	const record = records.find((record) => {
		if (record.name === name) {
			return record.id;
		}
	});
	return record.id;
}

async function getChannelsList() {
	const records = await airtable.getRecords(tableId, (record) => {
		const obj = {};
		obj.id = record.id;
		obj.name = record.fields["Name"];
		return obj;
	});
	return records;
}

export { getChannelId };
