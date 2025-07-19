import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
} from "chart.js";
import { ChartPie } from "lucide-react";
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Button } from "./ui/button";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LogsPieChart() {
  const [logData, setLogData] = useState<ChartData<"pie">>({
    labels: [],
    datasets: [],
  });

  function fetchLevels() {
    api.get("/logs/levels").then((response) => {
      const labels = Object.keys(response.data);
      const values = Object.values(response.data).map((v) => Number(v));

      const data = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ["#dc2627", "#facc15", "#60a5fa", "#4ade80"],
            borderWidth: 2,
          },
        ],
      };
      setLogData(data);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="font-bold text-green-500"
          variant="outline"
          onClick={fetchLevels}
        >
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
          {logData && <Pie className="w-full" data={logData} />}
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
