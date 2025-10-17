import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app.js';
import db from '../../models/index.js';

let testToken;
let superheroId;

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

beforeAll(async () => {
  await db.sequelize.sync({ force: true }); // очищаємо БД
  const [user] = await db.Users.findOrCreate({
    where: { email: 'e2e@example.com' },
    defaults: { fname: 'E2E', sname: 'Tester', password: '123456' },
  });

  testToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('E2E Superheroes Workflow', () => {
  test('Full workflow: create, favorite, update, delete superhero', async () => {
    // 1. Створюємо супергероя
    const createRes = await request(app)
      .post('/superheroes')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        nickname: 'IronMan',
        real_name: 'Tony Stark',
        origin_description: 'Genius billionaire',
        superpowers: 'Armor, AI',
        catch_phrase: 'I am IronMan',
      });
    expect(createRes.status).toBe(201);
    superheroId = createRes.body.id;

    // 2. Додаємо у фаворити
    const favRes = await request(app)
      .post('/users/favorites')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ superheroId });
    expect(favRes.status).toBe(201);
    expect(favRes.body.created).toBe(true);

    // 3. Оновлюємо супергероя
    const updateRes = await request(app)
      .put(`/superheroes/${superheroId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ nickname: 'IronManX' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.nickname).toBe('IronManX');

    // 4. Видаляємо супергероя
    const deleteRes = await request(app)
      .delete(`/superheroes/${superheroId}`)
      .set('Authorization', `Bearer ${testToken}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe('Superhero deleted');
  });
});
