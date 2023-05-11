import GamesRepository from "../repositories/games.repository.js";

export async function findController(req, res) {
  const { query } = res.locals;

  try {
    const games = await GamesRepository.find(query);
    return res.send(games);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function postController(req, res) {
  const { body } = res.locals;

  try {
    const games = await GamesRepository.post(body);
    return games !== null ? res.sendStatus(201) : res.sendStatus(409);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
