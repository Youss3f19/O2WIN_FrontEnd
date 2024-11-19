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
import { AuthComponent } from './component/main/auth/auth.component';
import { SignupComponent } from './component/main/auth/signup/signup.component';
import { LoginComponent } from './component/main/auth/login/login.component';
import { isAdminGuard } from './guards/is-admin.guard';
import { HomeComponent } from './component/main/home/home.component';
import { AboutusComponent } from './component/main/aboutus/aboutus.component';
import { ChoixpayementComponent } from './component/main/choixpayement/choixpayement.component';
import { PayementComponent } from './component/main/payement/payement.component';
import { InventoryComponent } from './component/main/inventory/inventory.component';
import { ProfileComponent } from './component/main/profile/profile.component';
import { MyboxesComponent } from './component/main/myboxes/myboxes.component';
import { FaqComponent } from './component/main/faq/faq.component';
import { ProduitComponent } from './component/main/produit/produit.component';
import { authGuard } from './guards/auth.guard';
import { PanierComponent } from './component/main/panier/panier.component';
import { ChangermdpComponent } from './component/main/changermdp/changermdp.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main/home', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
         canActivate: [isAdminGuard], 
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
            { path: 'auth', component: AuthComponent, 
                children: [
                    { path:'signup', component: SignupComponent },
                    { path: 'login', component: LoginComponent},
                ]
             },
             { path: 'home', component: HomeComponent },
             { path: 'aboutus', component: AboutusComponent },
             { path: 'choixpayement', component: ChoixpayementComponent },
             { path: 'payement', component: PayementComponent },
             { path: 'inventory', component: InventoryComponent },
             { path: 'profile', component: ProfileComponent },
             { path: 'myboxes', component: MyboxesComponent },
             { path: 'faq', component: FaqComponent },
             { path: 'panier', component: PanierComponent },
             { path: 'produit', canActivate:[authGuard] , component: ProduitComponent},
             { path: 'changepassword' , component: ChangermdpComponent}



        ]
    }
    
];
