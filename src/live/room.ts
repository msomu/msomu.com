import { DurableObject } from "cloudflare:workers";
import { liveTalks } from "./talks.ts";

type Role = "deck" | "remote";

interface Attachment {
	talk: string;
	role: Role | null;
}

interface Incoming {
	t?: unknown;
	role?: unknown;
	h?: unknown;
	total?: unknown;
}

/**
 * One room per pairing code (see src/worker.ts). The presenter's laptop
 * ("deck") reports the current slide; the phone that scanned its QR
 * ("remote") follows it and can ask the deck to move.
 */
export class LiveRoom extends DurableObject {
	async fetch(request: Request): Promise<Response> {
		if (request.headers.get("Upgrade") !== "websocket") {
			return new Response("Expected a WebSocket", { status: 426 });
		}
		const talk = new URL(request.url).searchParams.get("talk") ?? "";
		const pair = new WebSocketPair();
		const client = pair[0];
		const server = pair[1];
		this.ctx.acceptWebSocket(server);
		server.serializeAttachment({ talk, role: null } satisfies Attachment);
		return new Response(null, { status: 101, webSocket: client });
	}

	async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer) {
		if (typeof raw !== "string" || raw.length > 2048) return;
		let msg: Incoming;
		try {
			msg = JSON.parse(raw);
		} catch {
			return;
		}
		const me = ws.deserializeAttachment() as Attachment;
		const talk = liveTalks[me.talk];
		if (!talk) {
			ws.close(1008, "unknown talk");
			return;
		}

		if (msg.t === "hello") {
			const role =
				msg.role === "deck" || msg.role === "remote" ? msg.role : null;
			if (!role) {
				ws.send(JSON.stringify({ t: "denied" }));
				ws.close(1008, "denied");
				return;
			}
			ws.serializeAttachment({ talk: me.talk, role } satisfies Attachment);
			const h = (await this.ctx.storage.get<number>("h")) ?? 0;
			const total = (await this.ctx.storage.get<number>("total")) ?? 0;
			ws.send(JSON.stringify({ t: "state", h, total }));
			this.broadcastPeers();
			return;
		}

		if (!me.role) return;
		const h = msg.h;
		if (typeof h !== "number" || !Number.isInteger(h) || h < 0 || h > 500) {
			return;
		}

		if (msg.t === "slide" && me.role === "deck") {
			const total =
				typeof msg.total === "number" && Number.isInteger(msg.total)
					? msg.total
					: 0;
			await this.ctx.storage.put("h", h);
			await this.ctx.storage.put("total", total);
			this.send("remote", { t: "slide", h, total });
		} else if (msg.t === "go" && me.role === "remote") {
			this.send("deck", { t: "go", h });
		}
	}

	async webSocketClose(ws: WebSocket) {
		try {
			ws.close();
		} catch {
			// already closed
		}
		this.broadcastPeers();
	}

	async webSocketError() {
		this.broadcastPeers();
	}

	private sockets(role: Role): WebSocket[] {
		return this.ctx.getWebSockets().filter((ws) => {
			const a = ws.deserializeAttachment() as Attachment | null;
			return a?.role === role && ws.readyState === 1;
		});
	}

	private send(role: Role, data: unknown) {
		const text = JSON.stringify(data);
		for (const ws of this.sockets(role)) {
			try {
				ws.send(text);
			} catch {
				// socket went away; webSocketClose will update peers
			}
		}
	}

	private broadcastPeers() {
		const peers = {
			t: "peers",
			decks: this.sockets("deck").length,
			remotes: this.sockets("remote").length,
		};
		this.send("deck", peers);
		this.send("remote", peers);
	}
}
