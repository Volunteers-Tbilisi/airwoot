import http from "http";
import dotenv from "dotenv";
import chatwoot from "./api/chatwoot.js";

dotenv.config();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const routes = new Map();
// routes.set("/", (body) => console.log("Coonected to default route"));
routes.set("/api/chat-to-table/", chatwoot);
// TODO create route to handle reverse integration from airtable back to chatwoot

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`);

	if (req.method !== "POST" && !routes.has(url.pathname)) {
		console.log("404");
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Not found");
		return;
	}

	const callback = routes.get(url.pathname);

	let body = "";
	req.on("data", (chunk) => {
		body += chunk.toString();
	});
	req.on("end", async () => {
		console.log("Recieved webhook payload: " + body);
		const payload = JSON.parse(body);

		try {
			await callback(payload);
		} catch (err) {
			console.error(`Error loading module. `, err);
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Internal server error");
		}

		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("Webhook recieved");
	});
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

server.on("clientError", (err, socket) => {
	socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.on("error", (err) => {
	if (err.code === "EACESS") {
		console.log(`No access to port: ${port}`);
	}
});
