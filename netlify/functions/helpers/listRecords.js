import setBase from "./airtable";
import formattedReturn from "./formattedReturn";

export default async (TABLE_ID, remapFunc) => {
	const table = setBase(TABLE_ID);
	const tableRecords = [];

	try {
		await table.select().eachPage((records, fetchNextPage) => {
			const pageRecords = records.map(remapFunc);
			tableRecords.push(...pageRecords);
			fetchNextPage();
		});
	
		return formattedReturn(200, tableRecords);
	} catch (err) {
		console.log(err);
		return formattedReturn(500, 'Something went terribly wrong 🐑.')
	}
};