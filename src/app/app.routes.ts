import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MainComponent } from './component/main/main.component';
import { HomeDashboardComponent } from './component/dashboard/home-dashboard/home-dashboard.component';
import { ListBoxComponent } from './component/main/list-box/list-box.component';
import { AddBoxComponent } from './component/dashboard/add-box/add-box.component';
import { BoxTableComponent } from './component/dashboard/box-table/box-table.component';
import { ProductTableComponent } from './component/dashboard/product-table/product-table.component';
import { AddProductComponent } from './component/dashboard/add-product/add-product.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard/home-dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: 'home-dashboard', component: HomeDashboardComponent },
            { path: 'box-table', component: BoxTableComponent },
            { path: 'product-table', component: ProductTableComponent },
            { path: 'add-box', component: AddBoxComponent },
            { path: 'update-box/:id' , component: AddBoxComponent },
            { path: 'add-product' , component: AddProductComponent },
            { path: 'update-product/:id' , component: AddProductComponent },



        ]
    },
    {path: 'main',component: MainComponent,
        children: [
            { path: 'list-boxes', component: ListBoxComponent },


        ]
    }
    
];
