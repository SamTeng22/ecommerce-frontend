import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Orders } from './pages/orders/orders';;
import { Cart } from './pages/cart/cart';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { AdminOrders } from './pages/admin/admin-orders/admin-orders';
import { AdminProducts } from './pages/admin/admin-products/admin-products';
import { adminGuard } from './guards/admin-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'products', component: Products},
    { path: 'products/:id', component: ProductDetail},
    { path: 'cart', component: Cart, canActivate: [authGuard]},
    { path: 'orders', component: Orders, canActivate: [authGuard]},
    //Admin routes
    { path: 'admin', component: AdminDashboard, canActivate: [adminGuard]},
    { path: 'admin/products', component: AdminProducts, canActivate: [adminGuard]},
    { path: 'admin/orders', component: AdminOrders, canActivate: [adminGuard]},
    { path: '**', redirectTo: ''}
];
