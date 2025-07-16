import type { Log } from "@/lib/types";
import { useEffect } from "react";

export default function DisplayLogs({ logs }: { logs: Log[] }) {
  useEffect(() => {}, [logs]);

  return (
    <>
      {logs.map((log: Log) => (
        <div key={log.id} className="grid grid-cols-4 text-center">
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
