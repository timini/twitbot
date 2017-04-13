import SETTINGS from 'settings';

export class Logger {
  log() {
    throw new Error('not implemented');
  }
  info() {
    throw new Error('not implemented');
  }
  warn() {
    throw new Error('not implemented');
  }
  error() {
    throw new Error('not implemented');
  }
}

class DBLogger extends Logger() {
  constructor(DB) {
    if (isNil(DB)) throw new Error('Must provide an DB instance to this logger');
    this.DB = DB;
  }
  _write(level = 'info', msg = '', meta = {}) {
    return new (this.DB.models.LogEntry)({ level:'log' msg, meta }).save();
  }
  log(...args) {
    return this._write(level='log', ...args);
  }
  info(...args) {
    return this._write(level='info', ...args);
  }
  warn(...args) {
    return this._write(level='warn', ...args);
  }
  error(...args) {
    return this._write(level='error', ...args);
  }
}

class ConsoleLogger extends Logger {
  constructor() {
    return console;
  }
}

class MultiLogger extends Logger {
  constructor(loggers) {
    if (!Array.isArray(loggers)) throw new Error('please provide an array of loggers');
    this.loggers = loggers;
  }
  _callLoggers(method, ...args) => this.loggers.map(logger => logger[method](...args));
  log(...args) => this._callLoggers('log', ...args);
  info(...args) => this._callLoggers('info', ...args);
  warn(...args) => this._callLoggers('warn', ...args);
  error(...args) => this._callLoggers('error', ...args);
}

export const createLogger = DB => new MultiLogger([
  new DBLogger(DB),
  new ConsoleLogger(),
]);
