import TwitterChannel from './channel';


export class BaseTask {
  constructor(args) {
    this.storage = args.storage;
    this._data = args.data || [];
    this.logger = args.logger || console;
  }
  get data() {
    return this._data;
  }
  set data(data) {
    this._data = data;
  }
}


export default class TwitterTask extends BaseTask {
  constructor(args) {
    super(args);
    this.channel = new TwitterChannel();
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
