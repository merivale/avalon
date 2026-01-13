import { fileResponse } from "@/server/utils/response.ts";

export const handleStylesheet = () =>
  fileResponse("./client/styles.css", "text/css");

export const handleJavaScript = () =>
  fileResponse("./client/main.js", "application/javascript");
