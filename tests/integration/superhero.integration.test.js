import request from 'supertest';
import app from '../../app.js';
import db from '../../models/index.js';

let token;
let superheroId;

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.Favorites.destroy({ where: {} });
  await db.Superheroes.destroy({ where: {} });
  await db.Users.destroy({ where: {} });
  await db.sequelize.close();
});

describe('Users, Superheroes & Favorites API Integration', () => {
  test('POST /users/signUp - create user', async () => {
    const res = await request(app).post('/users/signUp').send({
      fname: 'UserFname',
      sname: 'UserSname',
      email: 'user_email@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user.id');
    token = res.body.token;
  });

  test('POST /users/signIn - login user', async () => {
    const res = await request(app).post('/users/signIn').send({
      email: 'user_email@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user.id');
    token = res.body.token;
  });

  test('POST /superheroes - create superhero', async () => {
    const res = await request(app)
      .post('/superheroes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nickname: 'SpiderMan',
        real_name: 'Peter Parker',
        origin_description:
          'A teenager bitten by a radioactive spider, gaining superhuman abilities.',
        superpowers:
          'Wall-crawling, super strength, spider-sense, web-shooting',
        catch_phrase: 'With great power comes great responsibility.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    superheroId = res.body.id;
  });

  test('PUT /superheroes/:id - update superhero', async () => {
    const res = await request(app)
      .put(`/superheroes/${superheroId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ catch_phrase: 'Genius, billionaire, playboy, philanthropist' });

    expect(res.statusCode).toBe(200);
    expect(res.body.catch_phrase).toBe(
      'Genius, billionaire, playboy, philanthropist',
    );
  });

  test('POST /users/favorites - add to favorites', async () => {
    const res = await request(app)
      .post('/users/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ superheroId });

    expect(res.statusCode).toBe(201);
  });

  test('GET /users/favorites - list favorites', async () => {
    const res = await request(app)
      .get('/users/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('favorites');
    expect(res.body.favorites.length).toBeGreaterThan(0);
  });

  test('DELETE /users/favorites/:id - remove favorite', async () => {
    const res = await request(app)
      .delete(`/users/favorites/${superheroId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Removed from favorites');
  });

  test('DELETE /superheroes/:id - delete superhero', async () => {
    const res = await request(app)
      .delete(`/superheroes/${superheroId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Superhero deleted');
  });
});
