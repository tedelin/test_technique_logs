import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import API from "@/lib/api";

function AddLog() {
  const [level, setLevel] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");

  async function addLog(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      log: {
        level,
        message,
        service,
        timestamp: new Date().toISOString(),
      },
    };

    console.log(payload);
    API.post("/logs/", payload);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Log</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={addLog}>
          <DialogHeader>
            <DialogTitle>Create Log</DialogTitle>
            <DialogDescription>
              Add a level, message and a service to create a log record.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="level">Level</Label>
              <Select onValueChange={(value) => setLevel(value)}>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="DEBUG">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="message">Message</Label>
              <Input
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="service">Service</Label>
              <Input
                name="service"
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="outline" type="submit">
              Create Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddLog;
