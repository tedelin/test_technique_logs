import API from "@/lib/api";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddLog from "./AddLog";
import DisplayLogs from "./DisplayLogs";

export default function SearchBar() {
  const [levelFilter, setLevelFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [liveLogs, setLiveLogs] = useState<any[]>([]);

  function fetchLogs() {
    API.get(
      `/logs/search?q=${search}&level=${levelFilter}&service=${serviceFilter}`,
    ).then(function (response) {
      setLogs(response.data);
      setLiveLogs([]);
    });
  }

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event == "newLog") {
        setLiveLogs((prevLogs) => [message.log, ...prevLogs]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [levelFilter, serviceFilter, search]);

  const allLogs = [...liveLogs, ...logs];

  return (
    <>
      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-3">
          <Input
            placeholder="🔍 Search by message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Input
          placeholder="Search by service"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        />
        <Select onValueChange={(value) => setLevelFilter(value)}>
          <SelectTrigger className="w-full" id="level">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INFO">Info</SelectItem>
            <SelectItem value="WARNING">Warning</SelectItem>
            <SelectItem value="ERROR">Error</SelectItem>
            <SelectItem value="DEBUG">Debug</SelectItem>
          </SelectContent>
        </Select>
        <AddLog />
      </div>
      <div className="grid grid-cols-4 border-b pt-4 pb-2 text-center font-bold">
        <div className="text-left">Date</div>
        <div>Message</div>
        <div>Level</div>
        <div>Service</div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <DisplayLogs logs={allLogs} />
      </div>
    </>
  );
}
