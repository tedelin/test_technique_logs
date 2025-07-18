import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import API from "@/lib/api";
import { Plus } from "lucide-react";
import { toast } from "sonner";

function AddLog() {
  const [level, setLevel] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");

  async function addLog(e: React.FormEvent) {
    e.preventDefault();

    if (level == "") {
      toast.error("Please select a level", {
        duration: 3000,
      });
      return;
    }

    const payload = {
      log: {
        level,
        message,
        service,
        timestamp: new Date().toISOString(),
      },
    };

    API.post("/logs/", payload)
      .then(() => {
        setService("");
        setLevel("");
        setMessage("");
        toast.success("Log successfully added", { duration: 2000 });
      })
      .catch((error) => {
        toast.error(error.message, { duration: 3000 });
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold text-green-500" variant="outline">
          <Plus />
          Add Log
        </Button>
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
            <div className="mt-4 grid gap-3">
              <Label htmlFor="level">Level</Label>
              <Select onValueChange={(value) => setLevel(value)}>
                <SelectTrigger className="w-full" id="level">
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
            <DialogClose asChild>
              <Button type="submit">Create Log</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddLog;
