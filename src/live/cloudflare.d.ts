// Minimal Cloudflare Workers types for the live talk room (src/worker.ts and
// src/live/room.ts). The project does not ship @cloudflare/workers-types, so
// only the APIs those two files touch are declared here.

declare module "cloudflare:workers" {
	export abstract class DurableObject<Env = unknown> {
		protected ctx: DurableObjectState;
		protected env: Env;
		constructor(ctx: DurableObjectState, env: Env);
	}
}

interface DurableObjectStorage {
	get<T = unknown>(key: string): Promise<T | undefined>;
	put<T = unknown>(key: string, value: T): Promise<void>;
}

interface DurableObjectState {
	storage: DurableObjectStorage;
	acceptWebSocket(ws: WebSocket, tags?: string[]): void;
	getWebSockets(tag?: string): WebSocket[];
}

interface WebSocket {
	serializeAttachment(value: unknown): void;
	deserializeAttachment(): unknown;
}

declare class WebSocketPair {
	0: WebSocket;
	1: WebSocket;
}

interface ResponseInit {
	webSocket?: WebSocket | null;
}

interface DurableObjectId {
	toString(): string;
}

interface DurableObjectStub {
	fetch(request: Request): Promise<Response>;
}

interface DurableObjectNamespace {
	idFromName(name: string): DurableObjectId;
	get(id: DurableObjectId): DurableObjectStub;
}
