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
  const [logs, setLogs] = useState([]);

  function fetchLogs() {
    API.get(
      `/logs/search?q=${search}&level=${levelFilter}&service=${serviceFilter}`,
    ).then(function (response) {
      setLogs(response.data);
    });
  }

  useEffect(() => {
    fetchLogs();
  }, [levelFilter, serviceFilter, search]);

  return (
    <>
      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-3">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Input
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
      <div className="mb-1 grid grid-cols-4 border-b pt-4 pb-2 text-center">
        <div className="text-left">Date</div>
        <div>Message</div>
        <div>Level</div>
        <div>Service</div>
      </div>
      <div className="h-full overflow-y-auto">
        <DisplayLogs logs={logs} />
      </div>
    </>
  );
}
