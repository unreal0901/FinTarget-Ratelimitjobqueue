import { config } from "dotenv";
config();
import cluster from "node:cluster";
import { cpus } from "os";
import { createServer } from "node:http";
import app from "./app";

// Workers
import { taskWorker } from "./Queues/TaskQueue/worker";

const PORT = process.env.PORT || 3000;
if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    if (i < numCPUs / 2) {
      cluster.fork({ WORKER_TYPE: "api" });
    } else {
      cluster.fork({ WORKER_TYPE: "queue" });
    }
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  if (process.env.WORKER_TYPE === "api") {
    createServer(app).listen(PORT, () => {
      console.log(
        `API Worker ${process.pid} started and listening on port ${PORT}`
      );
    });
  } else if (process.env.WORKER_TYPE === "queue") {
    taskWorker();
  }
}
