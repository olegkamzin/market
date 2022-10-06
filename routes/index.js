import Router from 'express'
import stocks from './stocks.js'

const router = new Router()

router.use('/stocks', stocks)

export default router
