import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-send-form2',
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    ButtonModule
  ],
  templateUrl: './send-form2.html',
  styleUrl: './send-form2.scss'
})
export class SendForm2 implements OnInit {
  eurAmount: number = 100;
  gnfAmount: number = 950000;
  exchangeRate: number = 9500;
  
  // Chemins possibles pour les drapeaux
  euFlag: string = 'demo/flags/1x1/eu.svg';
  gnFlag: string = 'demo/flags/1x1/gn.svg';

  ngOnInit() {
    this.calculateGNF();
    // Tester différents chemins
    this.tryFlagPaths();
  }

  tryFlagPaths() {
    // Liste des chemins possibles
    const possiblePaths = [
      { eu: 'demo/flags/1x1/eu.svg', gn: 'demo/flags/1x1/gn.svg' },
      { eu: 'assets/demo/flags/1x1/eu.svg', gn: 'assets/demo/flags/1x1/gn.svg' },
      { eu: 'demo/flags/eu.svg', gn: 'demo/flags/gn.svg' },
      { eu: 'assets/demo/flags/eu.svg', gn: 'assets/demo/flags/gn.svg' },
    ];

    // Afficher dans la console pour débogage
    console.log('Chemins testés pour les drapeaux:', possiblePaths);
  }

  onImageError(event: any, flag: string) {
    console.error(`Erreur de chargement du drapeau ${flag}:`, event.target.src);
    
    // Essayer des chemins alternatifs
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
    
    // Trouver le prochain chemin à essayer
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
    console.log('Envoi de', this.eurAmount, '€ =', this.gnfAmount, 'GNF');
  }
}