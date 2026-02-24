/**
 * Production-Ready Logger
 * 
 * This logger provides structured logging with different levels and formats
 * for development vs production environments.
 * 
 * In production, you can integrate with services like:
 * - Sentry (error tracking)
 * - LogRocket (session replay)
 * - Datadog (APM & logging)
 * - Logtail (structured logging)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log an informational message
   */
  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  /**
   * Log an error
   */
  error(message: string, error?: unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    this.log('error', message, errorContext);

    // In production, send to error tracking service
    if (!this.isDevelopment) {
      // TODO: Integrate with Sentry
      // Sentry.captureException(error, { extra: context });
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    
    if (this.isDevelopment) {
      // Development: Pretty console logging
      const colors = {
        info: '\x1b[36m',    // Cyan
        warn: '\x1b[33m',    // Yellow
        error: '\x1b[31m',   // Red
        debug: '\x1b[90m',   // Gray
      };
      const reset = '\x1b[0m';
      const color = colors[level];

      console.log(
        `${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`,
        context ? context : ''
      );
    } else {
      // Production: Structured JSON logging
      const logEntry = {
        level,
        timestamp,
        message,
        ...context,
      };

      // Send to stdout for log aggregation services
      console.log(JSON.stringify(logEntry));

      // TODO: Send to logging service (Logtail, Datadog, etc.)
      // await fetch(LOGGING_ENDPOINT, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry),
      // });
    }
  }
}

// Export singleton instance
export const logger = new Logger();
