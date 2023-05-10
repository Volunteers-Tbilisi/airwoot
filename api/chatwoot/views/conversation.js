import * as chatwoot from "../services/chatwoot.js";

async function sendPrivateMessage(contact, ticket, ids) {
	const content = ticket
		? `По этому запросу было создано новое обращение: ${ticket} \n\n Карточка контакта: ${contact}`
		: `Создайте новое обращение в карточке контакта для возобновлёного диалога: ${contact}`;
	const body = {
		content,
		message_type: "outgoing",
		private: true,
	};

	try {
		await chatwoot.sendMsg(body, ids);
	} catch (err) {
		throw { message: err, statusCode: 500 };
	}
}

export { sendPrivateMessage };
