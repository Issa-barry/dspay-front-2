import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
 import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from '@/layout/service/layout.service';
import {RippleModule} from "primeng/ripple";
import {KeyFilterModule} from "primeng/keyfilter";
import {InputNumber, InputNumberModule} from "primeng/inputnumber";
 
@Component({
  selector: 'app-verification',
     imports: [
        ButtonModule,
        RouterModule,
         FormsModule,
        InputNumberModule,
        RippleModule,
    ],
    standalone: true,
  templateUrl: './verification.html',
  styleUrl: './verification.scss'
})
export class Verification {
   layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    focusOnNext(inputEl: InputNumber) {
        inputEl.input.nativeElement.focus();
    }


  d1: number | null = null;
  d2: number | null = null;
  d3: number | null = null;
  d4: number | null = null;

  // true seulement si tout est saisi
 get isCodeComplete(): boolean {
  return [this.d1, this.d2, this.d3, this.d4]
    .every(v => v !== null && v !== undefined);
}


  verify() {
    if (!this.isCodeComplete) return;

    const code = `${this.d1}${this.d2}${this.d3}${this.d4}`;
    console.log('code:', code);
  }
 
}
