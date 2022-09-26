import express from 'express'
import path from 'path'
import ejs from 'ejs'


const PORT = process.env.PORT || 3000
const app = express()

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(process.cwd(), 'views'))

app.use(express.static(path.join(process.cwd(), 'public')))


app.get('/', (req, res) => res.render('index'))
app.get('/login', (req, res) => res.render('login'))
app.get('/shop', (req, res) => res.render('shop'))
app.get('/detail', (req, res) => res.render('detail'))
app.get('/cart', (req, res) => res.render('cart'))
app.get('/test', (req, res) => res.render('test'))
app.get('/contact', (req, res) => res.render('contact'))
app.get('/checkout', (req, res) => res.render('checkout'))
app.get('/admin', (req, res) => res.render('loginAdmin'))
app.get('/adminPanel', (req, res) => res.render('adminPanel'))
app.get('/departments', (req, res) => res.render('departments'))
app.get('/categories', (req, res) => res.render('categories'))
app.get('/products', (req, res) => res.render('products'))
app.get('/edit-product', (req, res) => res.render('edit-product'))
app.get('/add-product', (req, res) => res.render('add-product'))

app.use('*', (req, res, ) => {
    res.render('error')
})


app.listen(PORT, () => console.log(`server runnig http://localhost:${PORT}`))