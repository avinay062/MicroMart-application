class Logger {
  info(payload) {
    console.log('[info]', payload);
  }

  error(payload) {
    console.error('[error]', payload);
  }
}

const logger = new Logger();

module.exports = {
  Logger,
  logger
};
