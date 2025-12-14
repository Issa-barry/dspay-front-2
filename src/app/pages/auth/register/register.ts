import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';

interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        Select,
        AppFloatingConfigurator
    ],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register {
    currentStep: number = 0;
    
    // Form data
    selectedCountry: Country | null = null;
    phone: string = '';
    email: string = '';
    nom: string = '';
    prenom: string = '';
    password: string = '';
    
    // Countries list - Pays francophones et Europe
    countries: Country[] = [
        // Afrique francophone 
        // { name: 'Guinée', code: 'GN', dialCode: '+224', flag: 'https://flagcdn.com/gn.svg' },
        // { name: 'Sénégal', code: 'SN', dialCode: '+221', flag: 'https://flagcdn.com/sn.svg' },
        // { name: 'Mali', code: 'ML', dialCode: '+223', flag: 'https://flagcdn.com/ml.svg' },
        // { name: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225', flag: 'https://flagcdn.com/ci.svg' },
        
        // France et DOM-TOM
        { name: 'France', code: 'FR', dialCode: '+33', flag: 'https://flagcdn.com/fr.svg' },
        { name: 'Mayotte', code: 'YT', dialCode: '+262', flag: 'https://flagcdn.com/yt.svg' },
        { name: 'La Réunion', code: 'RE', dialCode: '+262', flag: 'https://flagcdn.com/re.svg' },
        { name: 'Guadeloupe', code: 'GP', dialCode: '+590', flag: 'https://flagcdn.com/gp.svg' },
        { name: 'Martinique', code: 'MQ', dialCode: '+596', flag: 'https://flagcdn.com/mq.svg' },
        { name: 'Guyane française', code: 'GF', dialCode: '+594', flag: 'https://flagcdn.com/gf.svg' },
        { name: 'Saint-Martin', code: 'MF', dialCode: '+590', flag: 'https://flagcdn.com/mf.svg' },
        { name: 'Saint-Barthélemy', code: 'BL', dialCode: '+590', flag: 'https://flagcdn.com/bl.svg' },
        { name: 'Saint-Pierre-et-Miquelon', code: 'PM', dialCode: '+508', flag: 'https://flagcdn.com/pm.svg' },
        { name: 'Wallis-et-Futuna', code: 'WF', dialCode: '+681', flag: 'https://flagcdn.com/wf.svg' },
        { name: 'Nouvelle-Calédonie', code: 'NC', dialCode: '+687', flag: 'https://flagcdn.com/nc.svg' },
        { name: 'Polynésie française', code: 'PF', dialCode: '+689', flag: 'https://flagcdn.com/pf.svg' },
        
        // Europe
        { name: 'Grèce', code: 'GR', dialCode: '+30', flag: 'https://flagcdn.com/gr.svg' },
        { name: 'Pays-Bas', code: 'NL', dialCode: '+31', flag: 'https://flagcdn.com/nl.svg' },
        { name: 'Belgique', code: 'BE', dialCode: '+32', flag: 'https://flagcdn.com/be.svg' },
        { name: 'Espagne', code: 'ES', dialCode: '+34', flag: 'https://flagcdn.com/es.svg' },
        { name: 'Hongrie', code: 'HU', dialCode: '+36', flag: 'https://flagcdn.com/hu.svg' },
        { name: 'Italie', code: 'IT', dialCode: '+39', flag: 'https://flagcdn.com/it.svg' },
        { name: 'Roumanie', code: 'RO', dialCode: '+40', flag: 'https://flagcdn.com/ro.svg' },
        { name: 'Suisse', code: 'CH', dialCode: '+41', flag: 'https://flagcdn.com/ch.svg' },
        { name: 'Autriche', code: 'AT', dialCode: '+43', flag: 'https://flagcdn.com/at.svg' },
        { name: 'Royaume-Uni', code: 'GB', dialCode: '+44', flag: 'https://flagcdn.com/gb.svg' },
        { name: 'Jersey', code: 'JE', dialCode: '+44', flag: 'https://flagcdn.com/je.svg' },
        { name: 'Guernesey', code: 'GG', dialCode: '+44', flag: 'https://flagcdn.com/gg.svg' },
        { name: 'Danemark', code: 'DK', dialCode: '+45', flag: 'https://flagcdn.com/dk.svg' },
        { name: 'Suède', code: 'SE', dialCode: '+46', flag: 'https://flagcdn.com/se.svg' },
        { name: 'Pologne', code: 'PL', dialCode: '+48', flag: 'https://flagcdn.com/pl.svg' },
        { name: 'Allemagne', code: 'DE', dialCode: '+49', flag: 'https://flagcdn.com/de.svg' },
        { name: 'Portugal', code: 'PT', dialCode: '+351', flag: 'https://flagcdn.com/pt.svg' },
        { name: 'Luxembourg', code: 'LU', dialCode: '+352', flag: 'https://flagcdn.com/lu.svg' },
        { name: 'Irlande', code: 'IE', dialCode: '+353', flag: 'https://flagcdn.com/ie.svg' },
        { name: 'Malte', code: 'MT', dialCode: '+356', flag: 'https://flagcdn.com/mt.svg' },
        { name: 'Chypre', code: 'CY', dialCode: '+357', flag: 'https://flagcdn.com/cy.svg' },
        { name: 'Finlande', code: 'FI', dialCode: '+358', flag: 'https://flagcdn.com/fi.svg' },
        { name: 'Bulgarie', code: 'BG', dialCode: '+359', flag: 'https://flagcdn.com/bg.svg' },
        { name: 'Lituanie', code: 'LT', dialCode: '+370', flag: 'https://flagcdn.com/lt.svg' },
        { name: 'Lettonie', code: 'LV', dialCode: '+371', flag: 'https://flagcdn.com/lv.svg' },
        { name: 'Estonie', code: 'EE', dialCode: '+372', flag: 'https://flagcdn.com/ee.svg' },
        { name: 'Croatie', code: 'HR', dialCode: '+385', flag: 'https://flagcdn.com/hr.svg' },
        { name: 'Tchéquie', code: 'CZ', dialCode: '+420', flag: 'https://flagcdn.com/cz.svg' },
        { name: 'Slovaquie', code: 'SK', dialCode: '+421', flag: 'https://flagcdn.com/sk.svg' }
    ];

    constructor() {
        // Set default country to Guinée
        this.selectedCountry = this.countries[0];
    }

    // Reste du code identique...
    isStep1Valid(): boolean {
        return !!(this.selectedCountry && this.phone && this.phone.length >= 8);
    }

    isStep2Valid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !!(this.email && emailRegex.test(this.email));
    }

    isStep3Valid(): boolean {
        return !!(this.nom && this.nom.trim() && this.prenom && this.prenom.trim());
    }

    isStep4Valid(): boolean {
        return !!(this.password && this.password.length >= 8);
    }

    nextStep(): void {
        if (this.canProceed()) {
            this.currentStep++;
        }
    }

    previousStep(): void {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    canProceed(): boolean {
        switch (this.currentStep) {
            case 0: return this.isStep1Valid();
            case 1: return this.isStep2Valid();
            case 2: return this.isStep3Valid();
            case 3: return this.isStep4Valid();
            default: return false;
        }
    }

    submitRegistration(): void {
        if (this.isStep4Valid()) {
            const registrationData = {
                country: this.selectedCountry,
                phone: this.selectedCountry?.dialCode + this.phone,
                email: this.email,
                nom: this.nom,
                prenom: this.prenom,
                password: this.password
            };
            
            console.log('Registration data:', registrationData);
        }
    }

    getProgress(): number {
        return ((this.currentStep + 1) / 4) * 100;
    }
}