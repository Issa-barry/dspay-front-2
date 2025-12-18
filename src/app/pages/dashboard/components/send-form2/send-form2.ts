import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-send-form2',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, ButtonModule],
  templateUrl: './send-form2.html',
  styleUrl: './send-form2.scss',
})
export class SendForm2 implements OnInit, OnChanges {
  @Input() exchangeRate: number = 0;
  @Input() taux_echange_id!: number;

  // ✅ NOMS BACK
  @Output() sendClicked = new EventEmitter<{
    montant_envoie: number;
    amount: number;
    taux_echange_id: number;
  }>();

  // ✅ champs de saisie (noms back)
  montant_envoie: number = 100;
  amount: number = 0;

  euFlag: string = 'demo/flags/1x1/eu.svg';
  gnFlag: string = 'demo/flags/1x1/gn.svg';

  loadingLogout = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.calculateAmount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exchangeRate']) {
      const prev = Number(changes['exchangeRate'].previousValue ?? 0);
      const curr = Number(changes['exchangeRate'].currentValue ?? 0);

      if (curr > 0 && curr !== prev) {
        this.calculateAmount();
      }
    }
  }

  // EUR -> GNF
  calculateAmount() {
    const rate = Number(this.exchangeRate || 0);
    const eur = Number(this.montant_envoie || 0);
    this.amount = rate > 0 ? Math.round(eur * rate) : 0;
  }

  // GNF -> EUR
  calculateMontantEnvoie() {
    const rate = Number(this.exchangeRate || 0);
    const gnf = Number(this.amount || 0);
    this.montant_envoie = rate > 0 ? Math.round((gnf / rate) * 100) / 100 : 0;
  }

  onSubmit() {
    if (!this.taux_echange_id || this.taux_echange_id <= 0) {
      console.error('taux_echange_id manquant');
      return;
    }

    const payload = {
      montant_envoie: Number(this.montant_envoie || 0),
      amount: Number(this.amount || 0),
      taux_echange_id: Number(this.taux_echange_id || 0),
    };

    console.log('✅ SEND-FORM2 payload (back aligned) =>', payload);
    this.sendClicked.emit(payload);
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
      eu: [
        'assets/demo/flags/1x1/eu.svg',
        'demo/flags/eu.svg',
        'assets/demo/flags/eu.svg',
        '/demo/flags/1x1/eu.svg',
      ],
      gn: [
        'assets/demo/flags/1x1/gn.svg',
        'demo/flags/gn.svg',
        'assets/demo/flags/gn.svg',
        '/demo/flags/1x1/gn.svg',
      ],
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
