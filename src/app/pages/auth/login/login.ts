import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';

interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        PasswordModule,
        SelectModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login implements OnInit {
    phone: string = '';
    password: string = '';
    selectedCountry: Country | null = null;

    countries: Country[] = [
        {
            name: 'Guinée',
            code: 'GN',
            dialCode: '+224',
            flag: 'https://flagcdn.com/gn.svg'
        },
        {
            name: 'France',
            code: 'FR',
            dialCode: '+33',
            flag: 'https://flagcdn.com/fr.svg'
        },
        {
            name: 'Sénégal',
            code: 'SN',
            dialCode: '+221',
            flag: 'https://flagcdn.com/sn.svg'
        },
        {
            name: 'Mali',
            code: 'ML',
            dialCode: '+223',
            flag: 'https://flagcdn.com/ml.svg'
        },
        {
            name: 'Côte d\'Ivoire',
            code: 'CI',
            dialCode: '+225',
            flag: 'https://flagcdn.com/ci.svg'
        }
    ];

    constructor(private router: Router) {}

    ngOnInit(): void {
        // Sélectionner la Guinée par défaut
        this.selectedCountry = this.countries[0];
    }

    isFormValid(): boolean {
        return this.phone.trim() !== '' && 
               this.password.trim() !== '' && 
               this.selectedCountry !== null;
    }

    async login(): Promise<void> {
        if (!this.isFormValid()) {
            return;
        }

        const fullPhone = `${this.selectedCountry!.dialCode}${this.phone}`;

        try {
            // TODO: Appeler votre API pour la connexion
            console.log('Connexion avec:', {
                phone: fullPhone,
                password: this.password
            });

            // Simuler un appel API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Rediriger vers le dashboard
            this.router.navigate(['/app/dashboard']);

        } catch (error) {
            console.error('Erreur de connexion:', error);
            // TODO: Afficher un message d'erreur à l'utilisateur
        }
    }
}