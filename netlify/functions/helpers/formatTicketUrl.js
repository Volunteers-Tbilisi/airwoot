import dotenv from 'dotenv';
import formattedReturn from './formattedReturn';

dotenv.config();

const BASE = process.env.AIRTABLE_BASE;
const TABLE = process.env.TABLE_TICKETS;
const VIEW = process.env.VIEW_TICKETS_DEFAULT;

export default async (ticketId) => {
	const ID = ticketId;
	const url = `https://airtable.com/${BASE}/${TABLE}/${VIEW}/${ID}?blocks=hide`;

	return formattedReturn(200, url);
};