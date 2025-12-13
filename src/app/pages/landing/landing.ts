import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
 import { HeroWidget } from './components/herowidget';
import { FeaturesWidget } from './components/featureswidget';
 import { PricingWidget } from './components/pricingwidget';
import { FooterWidget } from './components/footerwidget';
import { HeroComponent } from './hero/hero.component';
import { HighlightsWidget } from './components/highlights-widget/highlights-widget';
import { WalletWidget } from './components/wallet-widget/wallet-widget';
import { PartnerWidget } from './components/partner-widget/partner-widget';
import { TopbarWidget } from './components/topbar-widget/topbar-widget';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule,
         TopbarWidget, 
         HeroWidget,
         FeaturesWidget, 
         HighlightsWidget, 
         PricingWidget, 
         FooterWidget, 
         RippleModule, 
         StyleClassModule, 
         ButtonModule, 
         DividerModule,
         HeroComponent,
         WalletWidget,
         PartnerWidget
        ],
    templateUrl: './landing.html'
})
export class Landing {}
