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
			const order_number = String(req.body.order.id)
			const items = req.body.order.items
			const order = {
				accepted: true,
				id: order_number
			}
			if (req.body.order.fake) {
				return res.json({ order })
			}
			await items.forEach(async el => {
				await axios.post('https://api.shinpi.ru/kolobox/orders/', null, {
					params: { id: el.shopSku, quantity: el.count },
					headers: { token: process.env.TOKEN_API }
				}).then(async result => {
					await bot.sendMessage(263739791, `✅ Новый заказ <code>${order_number}</code> на сумму ${req.body.order.itemsTotal} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n<code>${el.offerId}</code>\r\n\r\nРезерв оформлен - <code>${result.data.orders[0]}</code>`, { parse_mode: 'HTML' }).catch(error => console.log(error))
					await bot.sendMessage(106773824, `✅ Новый заказ <code>${order_number}</code> на сумму ${req.body.order.itemsTotal} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n<code>${el.offerId}</code>\r\n\r\nРезерв оформлен - <code>${result.data.orders[0]}</code>`, { parse_mode: 'HTML' }).catch(error => console.log(error))
				}).catch(async error => {
					await bot.sendMessage(263739791, `🆘 Новый заказ <code>${order_number}</code> на сумму ${req.body.order.itemsTotal} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n<code>${el.offerId}</code>\r\n\r\nРезерв оформлен не оформлен!`, { parse_mode: 'HTML' }).catch(error => console.log(error))
					await bot.sendMessage(263739791, `🆘 Новый заказ <code>${order_number}</code> на сумму ${req.body.order.itemsTotal} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n<code>${el.offerId}</code>\r\n\r\nРезерв оформлен не оформлен!`, { parse_mode: 'HTML' }).catch(error => console.log(error))
				})
			});
			return res.json({ order })
		} catch (e) {
			console.log(e)
			next(ApiError.badRequest(e))
		}
	}

	async status (req, res, next) {
		try {
			return res.json('ok')
		} catch (e) {
			console.log(e)
			next(ApiError.badRequest(e))
		}
	}
}

export default new OrderController()
