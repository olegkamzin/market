import ApiError from '../service/error/ApiError.js'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

class CartController {
	async post (req, res, next) {
		try {
			const products = req.body.cart.items
			if (process.env.AUTH_TOKEN !== req.headers.authorization) return next(ApiError.unauthorized('Токен авторизации не верный.'))
			// if (req.headers.Authorization) 
			// apiYandex.defaults.headers.common['Authorization'] = `OAuth oauth_token=${globalThis.token}, oauth_client_id=${process.env.CLIENT_ID}`
			const items_result = []
			for (const el of products) {
                let count = 0
				await axios.get('https://api.shinpi.ru/kolobox/products/', {
					params: { id: el.offerId },
					headers: { token: process.env.TOKEN_API }
				})
					.then(result => {
                        count = result.data.count_local
						items_result.push({
							feedId: el.feedId,
							offerId: el.offerId,
							count: result.data.count_local === null ? 0 : count,
							warehouseId: el.warehouseId,
							partnerWarehouseId: el.partnerWarehouseId
						})
					})
					.catch(async () => {
						const product = await axios.get('https://api.shinpi.ru/product/' + el.offerId)
						items_result.push({
							feedId: el.feedId,
							offerId: el.offerId,
							count: product.quantity,
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
