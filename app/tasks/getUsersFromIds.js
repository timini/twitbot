import TwitterTask from './task';

export default class GetUsersFromIds extends TwitterTask {
  run(ids) {
    return this.channel.add({
      method: 'get',
      endpoint: 'users/lookup',
      params: {
        user_id: ids.splice(0, 100).join(','),
      },
    })
    .then(({ data }) => {
      this.data = this.data.concat(data);
      if (ids.length) {
        return this.run(ids);
      }
      return this.data;
    });
  }
}
