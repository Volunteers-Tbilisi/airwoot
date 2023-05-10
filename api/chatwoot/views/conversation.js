import * as chatwoot from "../services/chatwoot.js";

async function sendPrivateMessage(contact, ticket, ids) {
	const content = `По этому запроса было создано новое обращение: ${ticket} \n\n Карточка контакта: ${contact}`;
	const body = {
		content,
		message_type: "outgoing",
		private: true,
	};

	try {
		await chatwoot.sendMsg(body, ids);
	} catch (err) {
		console.log(err);
	}
}

export { sendPrivateMessage };
