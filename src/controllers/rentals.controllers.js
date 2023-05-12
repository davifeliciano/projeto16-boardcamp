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
