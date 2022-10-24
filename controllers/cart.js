import ApiError from '../service/error/ApiError.js'
import axios from 'axios'

class CartController {
	async post (req, res, next) {
		try {
			const products = req.body.cart.items
			console.log(req.body)
			const items_result = []
			for (const el of products) {
				await axios.get('https://api.shinpi.ru/kolobox/products/', {
					params: { id: el.offerId },
					headers: { token: 'zXHSPq96upy9bS2JoIDAbrGJwyoygSXZYSqcVERd' }
				})
					.then(result => {
						items_result.push({
							feedId: el.feedId,
							offerId: el.offerId,
							count: result.data.count_local,
							warehouseId: el.warehouseId,
							partnerWarehouseId: el.partnerWarehouseId
						})
					})
					.catch(error => {
						console.log(error)
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
			console.log(e)
		}
	}

}

export default new CartController()
