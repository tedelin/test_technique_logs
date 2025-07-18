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
import { toast } from "sonner";
import LogsPieChart from "./LogsPieChart";

export default function SearchBar() {
  const [levelFilter, setLevelFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<any[]>([]);

  function fetchLogs() {
    API.get(
      `/logs/search?q=${search}&level=${levelFilter}&service=${serviceFilter}`,
    )
      .then(function (response) {
        setLogs(response.data);
      })
      .catch((error) => {
        toast.error(error.message, { duration: 3000 });
      });
  }

  useEffect(() => {
    fetchLogs();
  }, [levelFilter, serviceFilter, search]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex w-full flex-row">
          <Input
            placeholder="Search by message"
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
        <LogsPieChart />
      </div>
      <div className="grid grid-cols-4 border-b pt-4 pb-2 text-center font-bold">
        <div className="text-left">Date</div>
        <div>Message</div>
        <div>Level</div>
        <div>Service</div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <DisplayLogs logs={logs} setLogs={setLogs} />
      </div>
    </>
  );
}
