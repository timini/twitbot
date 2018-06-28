import TwitterTask from './task';

export default class getFollowerIds extends TwitterTask {
  constructor(args) {
    super(args);
    this.count = 5000;
    this.userId = args.userId;
  }
  run(cursor = -1) {
    return this.channel.add({
      method: 'get',
      endpoint: 'followers/ids',
      params: {
        user_id: this.userId,
        cursor,
        count: this.count,
      },
    })
    .then(({ data: { ids, next_cursor: nextCursor } }) => {
      this.data = this.data.concat(ids);
      if (nextCursor) {
        return this.run(nextCursor);
      }
      return this.data;
    });
  }
}
