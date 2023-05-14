import RentalsRepository from "../repositories/rentals.repository.js";

export async function findController(req, res) {
  const { query } = res.locals;

  try {
    const rentals = await RentalsRepository.find(query);
    return res.send(rentals);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function postController(req, res) {
  const { body } = res.locals;

  try {
    const insertedCount = await RentalsRepository.post(body);
    return insertedCount !== 0 ? res.sendStatus(201) : res.sendStatus(400);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function returnController(req, res) {
  const { id } = res.locals;

  try {
    const updatedCount = await RentalsRepository.return(id);

    if (updatedCount !== 0) return res.sendStatus(200);

    const rental = await RentalsRepository.findById(id);
    return rental !== null ? res.sendStatus(400) : res.sendStatus(404);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
