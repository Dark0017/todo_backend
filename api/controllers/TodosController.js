/**
 * TodosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    const boardId = req.body?.boardId;
    const title = req.body?.title;
    const description = req.body.description;

    if (!boardId || !title) return res.badRequest();

    await Todos.create({
      title: title,
      description: description,
      boardId: boardId,
      isComplete: false,
    }).intercept((err) => {
      res.status(500);
      return res.send(err.message);
    });
    return res.ok();
  },
  get: async (req, res) => {
    const id = req.query.id;
    if (!id) return res.badRequest();

    const todo = await Todos.findOne({ id: id });
    if (!todo) return res.notFound();
    return res.json(todo);
  },
  getAll: async (req, res) => {
    const boardId = req.query.boardId;
    if (!boardId) return res.badRequest();

    const todos = await Todos.find({ boardId: boardId });
    if (!todos) return res.notFound();

    return res.json(todos);
  },
  edit: async (req, res) => {
    const id = req.query.id;
    const title = req.body.title;
    const description = req.body.description;
    if (!id || !title || description === null) return res.badRequest();

    const todo = await Todos.findOne({ id: id }).intercept((err) => {
      res.status(400);
      return res.send(err.message);
    });

    await Todos.updateOne({ id: id })
      .set({
        title: title,
        isComplete: todo.isComplete,
        description: description,
        boardId: todo.boardId,
      })
      .intercept((err) => {
        res.status(400);
        return res.send(err.message);
      });
    return res.ok();
  },
  complete: async (req, res) => {
    const id = req.query.id;
    if (!id) return res.badRequest();

    const todo = await Todos.findOne({ id: id }).intercept((err) => {
      res.status(400);
      return res.send(err.message);
    });

    await Todos.updateOne({ id: id })
      .set({
        title: todo.title,
        description: todo.description,
        isComplete: true,
      })
      .intercept((err) => {
        res.status(400);
        return res.send(err.message);
      });
    return res.ok();
  },
  delete: async (req, res) => {
    const id = req.query.id;
    if (!id) return res.badRequest();
    await Todos.destroyOne({ id: id }).intercept((err) => {
      res.status(400);
      return res.send(err.message);
    });
    return res.ok();
  },
};
