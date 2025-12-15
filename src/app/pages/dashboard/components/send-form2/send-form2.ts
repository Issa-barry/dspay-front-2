import { AuthService } from '@/pages/service/auth/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-send-form2',
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    
  ],
  templateUrl: './send-form2.html',
  styleUrl: './send-form2.scss'
})
export class SendForm2 implements OnInit {
  @Output() sendClicked = new EventEmitter<{ eurAmount: number, gnfAmount: number }>();

  eurAmount: number = 100;
  gnfAmount: number = 950000;
  exchangeRate: number = 9500;
  
  euFlag: string = 'demo/flags/1x1/eu.svg';
  gnFlag: string = 'demo/flags/1x1/gn.svg';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.calculateGNF();
  }

  onImageError(event: any, flag: string) {
    console.error(`Erreur de chargement du drapeau ${flag}:`, event.target.src);
    
    const alternativePaths: { [key: string]: string[] } = {
      'eu': [
        'assets/demo/flags/1x1/eu.svg',
        'demo/flags/eu.svg',
        'assets/demo/flags/eu.svg',
        '/demo/flags/1x1/eu.svg'
      ],
      'gn': [
        'assets/demo/flags/1x1/gn.svg',
        'demo/flags/gn.svg',
        'assets/demo/flags/gn.svg',
        '/demo/flags/1x1/gn.svg'
      ]
    };

    const paths = alternativePaths[flag];
    const currentSrc = event.target.src;
    
    for (let path of paths) {
      const fullPath = window.location.origin + '/' + path;
      if (currentSrc !== fullPath) {
        if (flag === 'eu') {
          this.euFlag = path;
        } else {
          this.gnFlag = path;
        }
        break;
      }
    }
  }

  calculateGNF() {
    this.gnfAmount = Math.round(this.eurAmount * this.exchangeRate);
  }

  calculateEUR() {
    this.eurAmount = Math.round((this.gnfAmount / this.exchangeRate) * 100) / 100;
  }

  onSubmit() {
    this.sendClicked.emit({
      eurAmount: this.eurAmount,
      gnfAmount: this.gnfAmount
    });
  }


loadingLogout: boolean = false;
 
  onLogout() {
        if (this.loadingLogout) return;

        this.loadingLogout = true;

        this.authService.logout().subscribe({
            next: () => (this.loadingLogout = false),
            error: () => (this.loadingLogout = false)
        });
    }
}