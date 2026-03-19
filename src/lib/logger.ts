const isDev = process.env.NODE_ENV !== "production";

function log(level: string, context: string, message: string, data?: unknown) {
  const ts = new Date().toISOString();
  const prefix = `[${level}] [${ts}] [${context}] ${message}`;
  if (data !== undefined) {
    console.log(prefix, data);
  } else {
    console.log(prefix);
  }
}

export const logger = {
  debug(context: string, message: string, data?: unknown) {
    if (!isDev) return;
    log("DEBUG", context, message, data);
  },
  info(context: string, message: string, data?: unknown) {
    log("INFO", context, message, data);
  },
  warn(context: string, message: string, data?: unknown) {
    log("WARN", context, message, data);
  },
  error(context: string, message: string, data?: unknown) {
    log("ERROR", context, message, data);
  },
};
