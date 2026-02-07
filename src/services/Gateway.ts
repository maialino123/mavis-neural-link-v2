// src/services/Gateway.ts

export type MessageHandler = (data: any) => void;

class GatewayService {
    private ws: WebSocket | null = null;
    private listeners: MessageHandler[] = [];
    private reqId = 1;
    private token: string = "";
    private url: string = "wss://bot.ecomatehome.com";
    private isConnected = false;

    constructor() {}

    init(token: string, url?: string) {
        this.token = token;
        if (url) this.url = url;
        this.connect();
    }

    private connect() {
        if (!this.token) return;
        
        console.log("Connecting to", this.url);
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log("WS Open. Sending Handshake...");
            this.sendRequest("connect", {
                minProtocol: 3,
                maxProtocol: 3,
                client: { 
                    id: "openclaw-control-ui", // CRITICAL: Must match server allowlist
                    version: "2.0.0", 
                    platform: "browser", 
                    mode: "ui" 
                },
                role: "operator",
                scopes: ["operator.read", "operator.write", "operator.admin"],
                auth: { token: this.token }
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (e) {
                console.error("Parse error", e);
            }
        };

        this.ws.onclose = () => {
            console.log("WS Closed. Reconnecting in 3s...");
            this.isConnected = false;
            this.notifyListeners({ type: "status", status: "disconnected" });
            setTimeout(() => this.connect(), 3000);
        };
    }

    private handleMessage(data: any) {
        // Handle Handshake Response
        if (data.type === "res" && data.payload?.type === "hello-ok") {
            console.log("Neural Link Established!");
            this.isConnected = true;
            this.notifyListeners({ type: "status", status: "connected" });
        }

        // Handle Chat Messages
        if (data.type === "event" && data.event === "agent.message") {
            this.notifyListeners({ type: "message", payload: data.payload });
        }
        
        // Handle Errors
        if (data.type === "res" && !data.ok) {
            console.error("Gateway Error:", data.error);
        }
    }

    sendChat(text: string) {
        if (!this.isConnected) return;
        this.sendRequest("agent.chat", {
            message: text,
            label: "main"
        });
    }

    sendVision(base64Image: string) {
        if (!this.isConnected) return;
        // Sending as a chat message with attachment
        // Note: Protocol V3 might handle multimodal differently, but for now we treat it as context
        // Ideally we should use a multimodal endpoint if available, but text context is safest start.
        this.sendRequest("agent.chat", {
            message: "I am looking at this page. Please analyze it.",
            label: "main",
            attachments: [{
                name: "screenshot.png",
                mimeType: "image/png",
                data: base64Image
            }]
        });
    }

    private sendRequest(method: string, params: any) {
        if (!this.ws) return;
        const id = `req-${this.reqId++}`;
        this.ws.send(JSON.stringify({ type: "req", id, method, params }));
    }

    subscribe(handler: MessageHandler) {
        this.listeners.push(handler);
        return () => {
            this.listeners = this.listeners.filter(h => h !== handler);
        };
    }

    private notifyListeners(data: any) {
        this.listeners.forEach(h => h(data));
    }
}

export const Gateway = new GatewayService();
