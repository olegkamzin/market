import ApiError from '../service/error/ApiError.js'
import axios from 'axios'

class StocksController {
	async post (req, res, next) {
		try {
			const { warehouseId, partnerWarehouseId, skus } = req.body
			console.log(req.body)
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

}

export default new StocksController()
