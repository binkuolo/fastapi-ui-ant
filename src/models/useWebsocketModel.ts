import { useCallback, useEffect, useState } from 'react';

export default function useWebsocketModel() {
  const [ws, setws] = useState<WebSocket>();
  const [online, setonline] = useState(false);
  const [onlineUser, setonlineUser] = useState<Websocket.OnlineUser>([]);
  const [messageList, setmessageList] = useState<Websocket.MessageList[]>([]);

  // websocket连接
  const connect_websocket = useCallback(() => {
    const token = localStorage.getItem('Authorization') || '';
    if (!ws && token) {
      console.log('ws_client ...');
      const protocol = window.location.protocol.indexOf('https:') == 0 ? 'wss' : 'ws';
      const websocket = new WebSocket(
        `${protocol}://${window.location.host}/ws/test?u_type=1`,
        token,
      );
      websocket.onopen = () => setws(websocket);
      websocket.onerror = () => {
        console.log('ws client error');
        setTimeout(() => connect_websocket(), 3000);
      };
    }
  }, [setws, ws]);

  useEffect(() => {
    if (ws) {
      setonline(true);
      console.log('ws_client ok');
      ws.onmessage = (ev: any) => {
        const msg: Websocket.Message = JSON.parse(ev.data);
        // 新成员加入
        if (msg.action == 'refresh_online_user') {
          setonlineUser(msg.data);
        }
        // 收到新消息
        if (msg.action == 'pull_msg') {
          const data = messageList.concat([{ id: msg.user, message: msg.data }]);
          setmessageList(data);
        }
      };
      // 断开监听
      ws.onclose = () => {
        console.log('通信已断开, 正在重新连接');
        setws(undefined);
        setonline(false);
      };
    }
  }, [ws, setonline, setonlineUser, setmessageList, messageList]);

  return { ws, setws, online, setonline, connect_websocket, onlineUser, messageList };
}
