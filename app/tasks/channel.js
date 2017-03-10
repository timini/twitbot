import Twit from 'twit';

export default class TwitterChannel {
  constructor(requestsPerMin = 1) {
    this.logger = console;
    const interval = ((60 / requestsPerMin) * 1000);
    this.lastRan = Date.now() - interval;
    this.Q = [];
    this.T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    setInterval(() => {
      if (Date.now() > this.lastRan + interval) {
        const command = this.Q.pop();
        if (command) {
          this.run(command);
          this.lastRan = Date.now();
        }
      }
    }, 1000);
  }
  add(command) {
    return new Promise((resolve, reject) => {
      this.Q.push({ command, resolve, reject });
    });
  }
  run({ command, command: { method, endpoint, params }, resolve }) {
    this.logger.log('running command.. ', command);
    this.T[method](endpoint, params)
    .then(data => resolve(data))
    .catch(err => this.logger.error(err));
  }
}
