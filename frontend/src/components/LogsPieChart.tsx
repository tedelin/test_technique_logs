import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ChartPie } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LogsPieChart() {
  const [logData, setLogData] = useState(null);

  useEffect(() => {
    api.get("/logs/levels").then((response) => setLogData(response.data));
  }, []);

  if (!logData) return <div>Loading...</div>;

  const labels = Object.keys(logData);
  const values = Object.values(logData);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#dc2626", "#facc15", "#60a5fa", "#4ade80"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold text-green-500" variant="outline">
          <ChartPie />
          Show Pie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Logs Repartition</DialogTitle>
          <DialogDescription>
            Pie Chart of logs repartition by level.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Pie className="w-full" data={data} />
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
