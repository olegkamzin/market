import ApiError from '../service/error/ApiError.js'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

class CartController {
	async post (req, res, next) {
		try {
			const products = req.body.cart.items
			const items_result = []
			for (const el of products) {
				await axios.get('https://api.shinpi.ru/kolobox/products/', {
					params: { id: el.offerId },
					headers: { token: process.env.TOKEN_API }
				})
					.then(result => {
						let count = 0
						if (result.data.count_local >= 2) {
							count = result.data.count_local
						}
						items_result.push({
							feedId: el.feedId,
							offerId: el.offerId,
							// count: result.data.count_local === null ? 0 : result.data.count_local,
							count: result.data.count_local === null ? 0 : count,
							warehouseId: el.warehouseId,
							partnerWarehouseId: el.partnerWarehouseId
						})
					})
					.catch(error => {
						items_result.push({
							feedId: el.feedId,
							offerId: el.offerId,
							count: 0,
							warehouseId: el.warehouseId,
							partnerWarehouseId: el.partnerWarehouseId
						})
					})
			}
			return res.json({ cart: { items: items_result } })
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

}

export default new CartController()
