import dotenv from 'dotenv';
import listRecords from './listRecords';
import createRecord from './createRecord';
import formattedReturn from './formattedReturn';

dotenv.config();

const PERSONS_TABLE_ID = process.env.TABLE_PERSONS;

export default async (initialCredentials) => {
	const {name, username, phone_number} = initialCredentials;

	// get all records from Persons table
	let persons = await listRecords(PERSONS_TABLE_ID, (record) => {
		return {
			id: record.id, 
			name: record.fields['Имя'], 
			username: record.fields['Номер телефона/ник'],
		};
	});
	persons = JSON.parse(persons.body);

	// lookup a user's card, create new if needed
	let personId = undefined;
	const checkPersonRecord = persons.find((record) => {
		if (record.name === name) {
			if (record.username === username || record.username === phone_number) {
				return record;
			}
		}
	});
	if (checkPersonRecord) {
		personId = checkPersonRecord.id;
	} else {
		const fields = {
			"Имя": name,
			"Номер телефона/ник": phone_number ?? username,
			"Привязанные каналы": [], // TODO connect channel source
			"Обращения": []
		};
		const person = await createRecord(PERSONS_TABLE_ID, fields);
		personId = JSON.parse(person.body)[0].id;
	}

	return formattedReturn(200, personId);
};