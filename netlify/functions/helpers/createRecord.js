import setBase from "./airtable";
import formattedReturn from "./formattedReturn";

export default async (TABLE_ID, fields) => {
	const table = setBase(TABLE_ID);
	try {
		const newRecord = await table.create([{ fields }]);
		return formattedReturn(201, newRecord);
	} catch (err) {
		console.log(err);
		return formattedReturn(500, 'Something went terribly wrong 🐑.')
	}
}