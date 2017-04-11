
// import neo4j from 'neo4j';
import DB from './db';
import { getFollowerIds, getUsersFromIds, writeToFile } from './tasks';
import { isNil } from 'ramda';

// TODO: use one channel for all tasks in the workflow
// TODO: add table for followers
// TODO: actually store stuff
// TODO: create simple strategies
// stratagies - simple
// Follow suggested users - keep record of the follow - unfollow previously followed
// use a seed group users you want to be engaged with either follow their friends,
class Workflow {
  constructor(db) {
    this.DB = db;
    this.workflow = [
      // { getUsers : '14387990' },
      { task: writeToFile, args: { filename: 'followers' } },
      { task: getUsersFromIds },
      { task: getFollowerIds, args: { userId: 'timrich' } },
    ];
  }
  run(data) {
    if (!this.workflow.length) {
      return data;
    }
    const { task: Task, args = {} } = this.workflow.pop();
    const task = new Task({ storage: this.DB, ...args });
    let promise;
    if (!isNil(data)) {
      promise = task.run(data);
    } else {
      promise = task.run();
    }
    return promise
    .then(result => this.run(result));
  }
}

const db = new DB();
const workflow = new Workflow(db);
const result = db.init()
.then(() => workflow.run());
console.log(result);

//class Stragegy {
//  start() {
//    throw new Error('not implimented');
//  }
//  complete() {
//    throw new Error('not implimented');
//  }
//  error() {
//    throw new Error('not implimented');
//  }
//}

// db.init().then(() => {
//   getFollowerIds('timrich')
//   .then(followerIds => {
//     console.log(`retrieved ${followerIds.length} followers`);
//     lookupUsersFromIds(followerIds)
//     .then(users => {
//       console.log(users);
//       db.connection('users').insert(...users.map(data => ({ data })));
//     });
//   });
// });


//
// // const db = new neo4j.GraphDatabase('http://neo4j:letmein@neo4j:7474');
//
//
// const getFollowers = (userId, cursor = -1, count = 200, channel = new Channel(), out = []) => {
//   return channel.add({
//     method: 'get',
//     endpoint: 'followers/list',
//     params: {
//       user_id: userId,
//       cursor,
//       count,
//     },
//   })
//   .then(({ data: { users, next_cursor: nextCursor } }) => {
//     if (nextCursor) {
//       return getFollowers(userId, nextCursor, 200, channel, out.concat(users));
//     }
//     return out.concat(users);
//   });
// };
//
//

//
// const getSuggestions = (channel = new Channel()) => {
//   return channel.add({
//     method: 'get',
//     endpoint: 'users/suggestions',
//   });
// };
//

// getFollowers('timrich')
// .then((followers) => {
//   const filename = 'followers.json';
//   if (existsSync(filename)) {
//     unlinkSync(filename);
//   }
//   writeFileSync(filename, JSON.stringify(followers, null, '  '));
// })
// .catch(err => console.log('error', err));

// getFollowerIds('timrich')
// .then((followers) => {
//   console.log(`retrieved ${followers.length} followers`);
//   // db.cypher({ query: 'CREATE (timrich:Person { name: "Tim Rich" });' });
//   lookupUsersFromIds(followers).then((users) => {
//     users.splice(0,10).forEach(
//       ({
//         name,
//         id,
//         screen_name,
//         location,
//         description,
//         url,
//         followers_count,
//         friends_count,
//         listed_count,
//         created_at,
//         favourites_count,
//         verified,
//         lang,
//         statuses_count,
//       }) => {
//       db.cypher(
//         {
//           query: `CREATE (${screen_name}:Person), (${screen_name})-[:FOLLOWS]->(timrich:Person);`,
//           params: {
//             name,
//             id,
//             screen_name,
//             location,
//             description,
//             url,
//             followers_count,
//             friends_count,
//             listed_count,
//             created_at,
//             favourites_count,
//             verified,
//             lang,
//             statuses_count,
//           },
//         },
//         (err, resp) => {
//           if (err) { console.error(err); }
//           console.log(resp);
//         },
//       );
//     });
//   })
// });


//
// getSuggestions().then(({ data }) => console.log(data));
