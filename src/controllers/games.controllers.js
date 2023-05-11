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
