import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ensureLogFileExists = (
  dirPath: string,
  filePath: string
): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
};


const logDir = path.join(__dirname, "../logs");
const logFile = path.join(logDir, "task-logs.txt");

export const setupLogging = () => {
  ensureLogFileExists(logDir, logFile);
  return logFile;
};
