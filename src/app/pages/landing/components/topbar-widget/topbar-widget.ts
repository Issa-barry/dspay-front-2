import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import {AppFloatingConfigurator} from "@/layout/component/app.floatingconfigurator";


@Component({
  selector: 'app-topbar-widget',
  standalone: true,
      imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, AppFloatingConfigurator],
  templateUrl: './topbar-widget.html',
  styleUrl: './topbar-widget.scss'
})
export class TopbarWidget {

  constructor(public router: Router) {}

}
