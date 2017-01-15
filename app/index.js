import Twit from 'twit';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import neo4j from 'neo4j';

let DATA_DIR_PATH;
if (process.env.CONTAINERISED) {
  DATA_DIR_PATH = '/data';
} else {
  DATA_DIR_PATH = '../data';
}

const writeToFile = (filename, data) => {
  const path = `${DATA_DIR_PATH}/${filename}.json`;
  if (existsSync(path)) {
    unlinkSync(path);
  }
  writeFileSync(path, JSON.stringify(data, null, '  '));
};

const db = new neo4j.GraphDatabase('http://neo4j:letmein@neo4j:7474');
console.log(db);

class Channel {
  constructor(requestsPerMin = 1) {
    const interval = ((60 / requestsPerMin) * 1000);
    this.lastRan = Date.now() - interval;
    this.Q = [];
    this.T = new Twit({
      consumer_key: 'LYN0VIaI6rokNaK6qI0O3Q',
      consumer_secret: 'aMjWHmWJqfj6S8D2gzYjJuQ55ERKt3LNdTWZ8rjvY',
      access_token: '14387990-rflo1EZRD5K52ZbswiPQu4Hn40FaOztPQLADvbZZw',
      access_token_secret: '6LWOgPufgxn93xIguJCb6maVQ8or0n94P3LuAWd08',
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
    console.info('running command.. ', command);
    this.T[method](endpoint, params)
    .then(data => resolve(data))
    .catch(err => console.error(err));
  }
}

const getFollowers = (userId, cursor = -1, count = 200, channel = new Channel(), out = []) => {
  return channel.add({
    method: 'get',
    endpoint: 'followers/list',
    params: {
      user_id: userId,
      cursor,
      count,
    },
  })
  .then(({ data: { users, next_cursor: nextCursor } }) => {
    if (nextCursor) {
      return getFollowers(userId, nextCursor, 200, channel, out.concat(users));
    }
    return out.concat(users);
  });
};


const getFollowerIds = (userId, cursor = -1, count = 5000, channel = new Channel(), out = []) => {
  return channel.add({
    method: 'get',
    endpoint: 'followers/ids',
    params: {
      user_id: userId,
      cursor,
      count,
    },
  })
  .then(({ data: { ids, next_cursor: nextCursor } }) => {
    if (nextCursor) {
      return getFollowers(userId, nextCursor, null, channel, out.concat(ids));
    }
    return out.concat(ids);
  });
};

const getSuggestions = (channel = new Channel()) => {
  return channel.add({
    method: 'get',
    endpoint: 'users/suggestions',
  })
};

const lookupUsersFromIds = (ids, channel = new Channel(600), out = []) => {
  return channel.add({
    method: 'get',
    endpoint: 'users/lookup',
    params: {
      user_id: ids.splice(0, 100).join(','),
    }
  })
  .then(({ data }) => {
    if (ids.length) {
      return lookupUsersFromIds(ids, channel, out.concat(data));
    }
    return out.concat(data);
  })
};

// getFollowers('timrich')
// .then((followers) => {
//   const filename = 'followers.json';
//   if (existsSync(filename)) {
//     unlinkSync(filename);
//   }
//   writeFileSync(filename, JSON.stringify(followers, null, '  '));
// })
// .catch(err => console.log('error', err));

getFollowerIds('timrich')
.then((followers) => {
  console.log(`retrieved ${followers.length} followers`);
  // db.cypher({ query: 'CREATE (timrich:Person { name: "Tim Rich" });' });
  lookupUsersFromIds(followers).then((users) => {
    users.splice(0,10).forEach(
      ({
        name,
        id,
        screen_name,
        location,
        description,
        url,
        followers_count,
        friends_count,
        listed_count,
        created_at,
        favourites_count,
        verified,
        lang,
        statuses_count,
      }) => {
      db.cypher(
        {
          query: `CREATE (${screen_name}:Person), (${screen_name})-[:FOLLOWS]->(timrich:Person);`,
          params: {
            name,
            id,
            screen_name,
            location,
            description,
            url,
            followers_count,
            friends_count,
            listed_count,
            created_at,
            favourites_count,
            verified,
            lang,
            statuses_count,
          },
        },
        (err, resp) => {
          if (err) { console.error(err); }
          console.log(resp);
        },
      );
    });
  })
});


//
// getSuggestions().then(({ data }) => console.log(data));

// stratagies - simple
// Follow suggested users - keep record of the follow - unfollow previously followed
// use a seed group users you want to be engaged with either follow their friends,
