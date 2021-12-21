/**
 * BoardsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    const title = req.body?.title;
    if (!title) return res.badRequest();

    await Boards.create({ title: title }).intercept((err) => {
      res.status(500);
      return res.send(err.message);
    });
    return res.ok();
  },
  get: async (req, res) => {
    const id = req.query.id;
    if (!id) return res.badRequest();
    const board = await Boards.findOne({ id: id });
    if (!board) return res.notFound();
    return res.json(board);
  },
  getAll: async (req, res) => {
    const boards = await Boards.find();
    if (!boards) return res.notFound();
    return res.json(boards);
  },
  edit: async (req, res) => {
    const id = req.query.id;
    const title = req.body.title;
    if (!id || !title) return res.badRequest();

    await Boards.updateOne({ id: id })
      .set({ title: title })
      .intercept((err) => {
        res.status(400);
        return res.send(err.message);
      });
    return res.ok();
  },
  delete: async (req, res) => {
    const id = req.query.id;
    if (!id) return res.badRequest();
    await Boards.destroyOne({ id: id }).intercept((err) => {
      res.status(400);
      return res.send(err.message);
    });
    return res.ok();
  },
};
