import { getPlans } from "../services/plan.service.js";

export async function getPlansController(req, res) {
  try {
    const plans = await getPlans();
    res.status(200).json(plans);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
