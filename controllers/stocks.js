import ApiError from '../service/error/ApiError.js'
import axios from 'axios'

class StocksController {
	async post (req, res, next) {
		try {
			const { warehouseId, partnerWarehouseId, skus } = req.body
			const skus_res = {}
			await axios.get('https://api.shinpi.ru/service/kolobox/products/?id=6310703ca85a7b4ddf84ddee', {
				headers: { token: 'zXHSPq96upy9bS2JoIDAbrGJwyoygSXZYSqcVERd' }
			})
				.then(result => console.log(result))
				.catch(error => console.log(error))
			// skus.forEach(async el => {
			// 	console.log(el)
				
			// })
			console.log(req.body)
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

}

export default new StocksController()
