import dotenv from "dotenv";
import Airtable from "airtable";

dotenv.config();
const BASE_ID = process.env.AIRTABLE_BASE;
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(BASE_ID);

function setBase(tableId) {
	return base(tableId);
}

async function getRecords(tableId, remapFunc) {
	const table = setBase(tableId);

	try {
		const tableRecords = [];
		await table.select().eachPage((records, fetchNextPage) => {
			const pageRecords = records.map(remapFunc);
			tableRecords.push(...pageRecords);
			fetchNextPage();
		});
		return tableRecords;
	} catch (err) {
		throw { message: `Couldn't read from table (ref id: ${tableId})`, statusCode: 500 };
	}
}

async function createRecord(tableId, fields) {
	const table = setBase(tableId);

	try {
		const newRecord = await table.create(fields);
		return newRecord;
	} catch (err) {
		throw { message: `Couldn't write to a table (ref id: ${tableId})`, statusCode: 500 };
	}
}

function serializeURL(TABLE_ID, VIEW_ID, RECORD_ID) {
	const url = `https://airtable.com/${BASE_ID}/${TABLE_ID}/${VIEW_ID}/${RECORD_ID}?blocks=hide`;
	return url;
}

export { getRecords, createRecord, serializeURL };
