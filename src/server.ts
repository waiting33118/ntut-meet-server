import * as WebSocket from 'ws';
import { Server } from 'ws';

enum SERVER {
  PORT = 3030
}

const wss = new Server(
  {
    host: 'localhost',
    port: SERVER.PORT
  },
  () => {
    console.log(`Websocket Server is listening on port: ${SERVER.PORT}`);
  }
);

enum EventTypes {
  NEW_USER = 'newUser',
  CHAT = 'chat',
  OFFER = 'offer',
  ANWSER = 'anwser',
  CANDIDATE = 'candidate'
}

interface IMessagePayload {
  event: EventTypes;
  payload: any;
}

const broadCastExceptSelf = (ws: WebSocket, payload: string) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

const broadCastAll = (payload: string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (msg: Buffer) => {
    const jsonFormat = msg.toString();
    const normalize: IMessagePayload = JSON.parse(jsonFormat);
    console.log(normalize.event, normalize.payload.username);
    switch (normalize.event) {
      case EventTypes.NEW_USER:
        broadCastExceptSelf(ws, jsonFormat);
        break;
      case EventTypes.CHAT:
        broadCastAll(jsonFormat);
        break;
      case EventTypes.OFFER:
        broadCastExceptSelf(ws, jsonFormat);
        break;
      case EventTypes.ANWSER:
        broadCastExceptSelf(ws, jsonFormat);
        break;
      case EventTypes.CANDIDATE:
        broadCastExceptSelf(ws, jsonFormat);
        break;
    }
  });
});
