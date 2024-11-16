import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MainComponent } from './component/main/main.component';
import { HomeDashboardComponent } from './component/dashboard/home-dashboard/home-dashboard.component';
import { ListBoxComponent } from './component/main/list-box/list-box.component';
import { AddBoxComponent } from './component/dashboard/add-box/add-box.component';
import { BoxTableComponent } from './component/dashboard/box-table/box-table.component';
import { ProductTableComponent } from './component/dashboard/product-table/product-table.component';
import { AddProductComponent } from './component/dashboard/add-product/add-product.component';
import { CategorieTableComponent } from './component/dashboard/categorie-table/categorie-table.component';
import { AddCategoryComponent } from './component/dashboard/add-category/add-category.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main/list-boxes', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: 'home-dashboard', component: HomeDashboardComponent },
            { path: 'box-table', component: BoxTableComponent },
            { path: 'product-table', component: ProductTableComponent },
            { path: 'category-table', component: CategorieTableComponent },
            { path: 'add-box', component: AddBoxComponent },
            { path: 'update-box/:id' , component: AddBoxComponent },
            { path: 'add-product' , component: AddProductComponent },
            { path: 'update-product/:id' , component: AddProductComponent },
            { path: 'add-category' , component: AddCategoryComponent },
            { path: 'update-category/:id' , component: AddCategoryComponent },




        ]
    },
    {path: 'main',component: MainComponent,
        children: [
            { path: 'list-boxes', component: ListBoxComponent },


        ]
    }
    
];
