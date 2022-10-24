import Router from 'express'
import stocks from './stocks.js'
import cart from './cart.js'
import order from './order.js'

const router = new Router()

router.use('/stocks', stocks)
router.use('/cart', cart)
router.use('/order', order)

export default router
