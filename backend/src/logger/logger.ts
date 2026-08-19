import pino from "pino";

const loggerConfig = {
    level: process.env.LOG_LEVEL ?? "info",
} as const;

const transport =
    process.env.NODE_ENV !== "production"
        ? {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:standard",
                  ignore: "pid,hostname",
              },
          }
        : undefined;

export const logger = pino(
    transport ? { ...loggerConfig, transport } : loggerConfig
);