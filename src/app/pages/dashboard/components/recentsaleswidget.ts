import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../service/product.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">Historique Transactions</div>
        <p-table [value]="products" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                 
            </ng-template>
            <ng-template #body let-product>
                <tr> 
                    <td style="width: 75%; min-width: 7rem;">{{ product.name }}</td>
                    <td style="width: 5%; min-width: 8rem;">{{ product.price | currency: 'USD' }}</td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: [ProductService]
})
export class RecentSalesWidget {
    products!: Product[];

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => (this.products = data));
    }
}
