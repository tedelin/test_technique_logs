import type { Log } from "@/lib/types";
import { useEffect } from "react";

export default function DisplayLogs({
  logs,
  setLogs,
}: {
  logs: Log[];
  setLogs: Function;
}) {
  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event == "newLog") {
        setLogs((prevLogs: Log[]) => [message.log, ...prevLogs]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      {logs.map((log: Log) => (
        <div
          key={log.id}
          className="grid grid-cols-4 border-b py-4 text-center"
        >
          <div className="text-left">
            {new Date(log.timestamp).toLocaleString()}
          </div>
          <div>{log.message}</div>
          <div>{log.level}</div>
          <div>{log.service}</div>
        </div>
      ))}
    </>
  );
}
