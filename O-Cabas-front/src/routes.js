import Home from './pages/Home.svelte';
import Producers from './pages/Producers.svelte';
import Products from './pages/Products.svelte';
import Product from './components/EditProduct.svelte'
import Users from './pages/Users.svelte';
import User from './pages/User.svelte';
import Contact from './pages/Contact.svelte';
import Login from './pages/Login.svelte';
import Register from './pages/Register.svelte';
import Account from './pages/Account.svelte';
import MyOrders from './pages/MyOrders.svelte';
import MyOrderDetail from './pages/MyOrderDetail.svelte';
import Orders from './pages/Orders.svelte';
import OrderDetail from './pages/OrderDetail.svelte';


export default {
  '/': Home,
  '/producers': Producers,
  '/products': Products,
  '/product/:id': Product,
  '/users': Users,
  "/user/:id": User,
  '/contact': Contact,
  '/login': Login,
  '/register': Register,
  '/account': Account,
  '/my_orders': MyOrders,
  '/my_order_detail/:id': MyOrderDetail,
  '/orders': Orders,
  '/order/:id': OrderDetail,
}