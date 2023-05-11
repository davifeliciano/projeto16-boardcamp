import CustomersRepository from "../repositories/customers.repository.js";

export async function findController(req, res) {
  const { query } = res.locals;

  try {
    const customers = await CustomersRepository.find(query);
    return res.send(customers);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function findByIdController(req, res) {
  const { id } = res.locals;

  try {
    const customer = await CustomersRepository.findById(id);
    return customer !== null ? res.send(customer) : res.sendStatus(404);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}

export async function postController(req, res) {
  const { body } = res.locals;

  try {
    const insertedCount = await CustomersRepository.post(body);
    return insertedCount !== 0 ? res.sendStatus(201) : res.sendStatus(409);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
