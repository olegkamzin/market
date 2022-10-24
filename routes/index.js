import Router from 'express'
import stocks from './stocks.js'
import cart from './cart.js'
import order from './order.js'

const router = new Router()

router.use('/market/stocks', stocks)
router.use('/market/cart', cart)
router.use('/market/order', order)

export default router
