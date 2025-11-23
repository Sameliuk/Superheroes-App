import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

const BASE = 'http://localhost:3000';

export default function () {
  const randomId = Date.now() + Math.floor(Math.random() * 1000);
  const signUpPayload = JSON.stringify({
    fname: 'Test',
    sname: 'User',
    email: `testuser${randomId}@example.com`,
    password: '12345678',
  });

  const signUpRes = http.post(`${BASE}/users/signUp`, signUpPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(signUpRes, {
    'signUp success': (r) => r.status === 201,
  });

  const { token } = signUpRes.json();

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const heroPayload = JSON.stringify({
    nickname: 'SpiderMan' + randomId,
    real_name: 'Peter Parker',
    origin_description:
      'A teenager bitten by a radioactive spider, gaining superhuman abilities.',
    superpowers: 'Wall-crawling, super strength, spider-sense, web-shooting',
    catch_phrase: 'With great power comes great responsibility.',
  });

  const createHeroRes = http.post(
    `${BASE}/superheroes`,
    heroPayload,
    authHeaders,
  );

  check(createHeroRes, {
    'hero created': (r) => r.status === 201,
  });

  const heroId = createHeroRes.json('id');

  const updatePayload = JSON.stringify({ catch_phrase: 'Updated phrase' });
  const updateRes = http.put(
    `${BASE}/superheroes/${heroId}`,
    updatePayload,
    authHeaders,
  );

  check(updateRes, {
    'hero updated': (r) => r.status === 200,
  });

  const addFavRes = http.post(
    `${BASE}/users/favorites`,
    JSON.stringify({ superheroId: heroId }),
    authHeaders,
  );

  check(addFavRes, {
    'added to favorites': (r) => r.status === 201,
  });

  const removeFavRes = http.del(
    `${BASE}/users/favorites/${heroId}`,
    null,
    authHeaders,
  );

  check(removeFavRes, {
    'removed from favorites': (r) => r.status === 200,
  });

  const heroesRes = http.get(`${BASE}/superheroes`, authHeaders);

  check(heroesRes, {
    'get superheroes': (r) => r.status === 200,
  });

  const deleteHeroRes = http.del(
    `${BASE}/superheroes/${heroId}`,
    null,
    authHeaders,
  );

  check(deleteHeroRes, {
    'hero deleted': (r) => r.status === 200,
  });

  sleep(1);
}
