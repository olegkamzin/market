import ApiError from '../service/error/ApiError.js'
import axios from 'axios'

class StocksController {
	async post (req, res, next) {
		try {
			const { warehouseId, partnerWarehouseId, skus } = req.body
			const skus_res = []
			const date = new Date()
			const products = await axios.get('https://api.shinpi.ru/product/', {
				params: {
					category: 'tyres',
					limit: 5000
				}
			})
			await skus.forEach(async el => {
				const pr = products.data.find(find => find._id === el)
				if (!pr) {
					return skus_res.push({
						sku: el,
						warehouseId: warehouseId,
						items: [
							{
								type: 'FIT',
								count: 0,
								updatedAt: date.toISOString()
							  }
						]
					})
				} else {
					return skus_res.push({
						sku: el,
						warehouseId: warehouseId,
						items: [
							{
								type: 'FIT',
								count: pr.quantity,
								updatedAt: date.toISOString()
							  }
						]
					})
				}
			})
			return res.json({ skus: skus_res })
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

}

export default new StocksController()
