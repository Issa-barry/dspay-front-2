import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-send-form2',
  imports: [CommonModule, FormsModule, InputNumberModule, ButtonModule],
  templateUrl: './send-form2.html',
  styleUrl: './send-form2.scss',
})
export class SendForm2 implements OnInit, OnChanges {
  @Input() exchangeRate: number = 0;
  @Input() tauxEchangeId!: number;

  @Output() sendClicked = new EventEmitter<{
    eurAmount: number;
    gnfAmount: number;
    taux_echange_id: number;
  }>();

  eurAmount: number = 100;
  gnfAmount: number = 0;

  euFlag: string = 'demo/flags/1x1/eu.svg';
  gnFlag: string = 'demo/flags/1x1/gn.svg';

  loadingLogout = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // ✅ 1er calcul si le taux est déjà présent
    this.calculateGNF();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // ✅ recalcul dès que le taux arrive (ou change)
    if (changes['exchangeRate']) {
      const prev = Number(changes['exchangeRate'].previousValue ?? 0);
      const curr = Number(changes['exchangeRate'].currentValue ?? 0);

      // si on passe de 0 -> 9600 (ou taux modifié)
      if (curr > 0 && curr !== prev) {
        this.calculateGNF();
      }
    }
  }

  calculateGNF() {
    const rate = Number(this.exchangeRate || 0);
    const eur = Number(this.eurAmount || 0);
    this.gnfAmount = rate > 0 ? Math.round(eur * rate) : 0;
  }

  calculateEUR() {
    const rate = Number(this.exchangeRate || 0);
    const gnf = Number(this.gnfAmount || 0);
    this.eurAmount = rate > 0 ? Math.round((gnf / rate) * 100) / 100 : 0;
  }

  onSubmit() {
    if (!this.tauxEchangeId || this.tauxEchangeId <= 0) {
      console.error('tauxEchangeId manquant');
      return;
    }

    this.sendClicked.emit({
      eurAmount: this.eurAmount,
      gnfAmount: this.gnfAmount,
      taux_echange_id: this.tauxEchangeId,
    });
  }

  onLogout() {
    if (this.loadingLogout) return;
    this.loadingLogout = true;

    this.authService.logout().subscribe({
      next: () => (this.loadingLogout = false),
      error: () => (this.loadingLogout = false),
    });
  }

  onImageError(event: any, flag: string) {
    const alternativePaths: { [key: string]: string[] } = {
      eu: ['assets/demo/flags/1x1/eu.svg', 'demo/flags/eu.svg', 'assets/demo/flags/eu.svg', '/demo/flags/1x1/eu.svg'],
      gn: ['assets/demo/flags/1x1/gn.svg', 'demo/flags/gn.svg', 'assets/demo/flags/gn.svg', '/demo/flags/1x1/gn.svg'],
    };

    const paths = alternativePaths[flag];
    const currentSrc = event.target.src;

    for (let path of paths) {
      const fullPath = window.location.origin + '/' + path;
      if (currentSrc !== fullPath) {
        if (flag === 'eu') this.euFlag = path;
        else this.gnFlag = path;
        break;
      }
    }
  }
}
