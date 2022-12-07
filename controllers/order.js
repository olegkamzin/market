import ApiError from '../service/error/ApiError.js'
import axios from 'axios'
import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
dotenv.config()

const token = process.env.TOKEN
const bot = new TelegramBot(token, { polling: true })

class OrderController {
	async post (req, res, next) {
		try {
			const token = req.headers.token
			if (token !== process.env.TOKEN) {
				return next(ApiError.unauthorized('Нет доступа.'))
			}
			const order_number = String(req.body.order.id)
			const items = req.body.order.items
			const order = {
				accepted: true,
				id: order_number
			}
			if (req.body.order.fake) {
				return res.json({ order })
			}
			await items.forEach(el => {
				axios.post('https://api.shinpi.ru/kolobox/orders/', null, {
					params: { id: el.shopSku, quantity: el.count },
					headers: { token: process.env.TOKEN_API }
				}).then(async result => {
					const product = await axios.get('https://api.shinpi.ru/product/' + el.shopSku)
					await bot.sendMessage(263739791, `✅ Новый заказ <code>${order_number}</code> на сумму ${product.price} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n\r\n- Артикул: <code>${product.article}</code>\r\n- ID: <code>${el.offerId}</code>\r\n- Резерв: <code>${result.data.orders[0]}</code>\r\n- Оптовая цена: ${product.wholesale_price}`, {parse_mode: 'HTML'}).catch(error => console.log(error))
					await bot.sendMessage(106773824, `✅ Новый заказ <code>${order_number}</code> на сумму ${product.price} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n\r\n- Артикул: <code>${product.article}</code>\r\n- ID: <code>${el.offerId}</code>\r\n- Резерв: <code>${result.data.orders[0]}</code>\r\n- Оптовая цена: ${product.wholesale_price}`, {parse_mode: 'HTML'}).catch(error => console.log(error))
				}).catch(async error => {
					await bot.sendMessage(263739791, `🆘 Новый заказ <code>${order_number}</code> на сумму ${req.body.order.itemsTotal} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n<code>${el.offerId}</code>\r\n\r\nРезерв не оформлен!`, { parse_mode: 'HTML' }).catch(error => console.log(error))
					await bot.sendMessage(106773824, `🆘 Новый заказ <code>${order_number}</code> на сумму ${req.body.order.itemsTotal} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n<code>${el.offerId}</code>\r\n\r\nРезерв не оформлен!`, { parse_mode: 'HTML' }).catch(error => console.log(error))
				})
			})
			return res.json({ order })
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

	async status (req, res, next) {
		try {
			return res.json('ok')
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}
}

export default new OrderController()
