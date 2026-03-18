const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/database');
const taskModel = require('../src/models/task');

beforeAll((done) => {
  // Ensure the table is created before running tests
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('pending', 'done')) DEFAULT 'pending',
      deadline TEXT
    )`, () => done());
});

beforeEach((done) => {
  // Clear tasks before each test
  taskModel.clearTasks(done);
});

afterAll((done) => {
  db.close(done);
});

describe('Task API Endpoints', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        deadline: '2023-12-31'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('Test Task');
    expect(res.body.status).toEqual('pending');
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        description: 'No title provided',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should list all tasks', async () => {
    // Insert a task directly via API to ensure it exists
    await request(app).post('/tasks').send({ title: 'Task 1' });
    await request(app).post('/tasks').send({ title: 'Task 2' });

    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(2);
  });

  it('should update a task status and deadline', async () => {
    // Create task first
    const createRes = await request(app)
      .post('/tasks')
      .send({ title: 'Task to update', deadline: '2023-01-01' });

    const taskId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ status: 'done', deadline: '2023-01-15' });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.message).toEqual('Task updated successfully');

    // Verify update
    const getRes = await request(app).get('/tasks');
    const updatedTask = getRes.body.find(t => t.id === taskId);
    
    expect(updatedTask.status).toEqual('done');
    expect(updatedTask.deadline).toEqual('2023-01-15');
  });

  it('should return 400 for invalid status', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .send({ title: 'Task with invalid status' });

    const taskId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ status: 'in-progress' }); // Invalid status

    expect(updateRes.statusCode).toEqual(400);
  });
});
