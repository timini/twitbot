import TwitterChannel from './channel';

export default class TwitterTask {
  constructor(storage) {
    this.channel = new TwitterChannel();
    this.data = [];
    this.storage = storage;
    this.logger = console;
  }
  get data() {
    return this.data;
  }
  set data(data) {
    this.data = data;
  }
  start(args) {
    this.logger.log('starting');
    return this.run(args)
    .then(data => this.complete(data));
  }
  complete() {
    this.storage.save(this.data)
    .then(this.workflow.next);
  }
  run() {
    throw new Error('not implimented');
  }
}
