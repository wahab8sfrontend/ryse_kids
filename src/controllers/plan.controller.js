import { getPlans, createInvestment } from "../services/plan.service.js";
import { investSchema } from "../validators/investment.validator.js";

export async function getPlansController(req, res) {
  try {
    const plans = await getPlans();
    res.status(200).json(plans);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function createInvestmentController(req, res) {
  const validationResult = investSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.issues });
  }

  try {
    const invest = await createInvestment(validationResult.data, req.user.id);
    res.status(201).json(invest);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
