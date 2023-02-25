import dotenv from 'dotenv';
import createRecord from './createRecord';
import formattedReturn from './formattedReturn';

dotenv.config();

const TICKETS_TABLE_ID = process.env.TABLE_TICKETS;

export default async (initialCredentials) => {
	const {username, phone_number, personId, date} = initialCredentials;

	const fields = {
		"Дата обращений": date,
		"ФИО": [
			personId
		],
		"Номер телефона": phone_number ?? username,
		"Источник обращений": [],
		"Оператор": [],
		"Запрос": "Freedom",
		"Тип Обращений": [],
		"Итоговый Результат": null,
		"Статус": 'Новая'
	};

	let newTicketId = await createRecord(TICKETS_TABLE_ID, fields);

	newTicketId = JSON.parse(newTicketId.body)[0].id;

	return formattedReturn(201, newTicketId);
};