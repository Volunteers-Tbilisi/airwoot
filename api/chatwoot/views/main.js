import * as chatwoot from "../services/chatwoot.js";

async function sendPrivateMessage(contact, ticket, ids) {
	const content = `Для данного запроса было создано новое обращение: ${ticket} \n Карточка запрашивающего: ${contact}`;
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
