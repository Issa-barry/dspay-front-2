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
    
    // Countries list
    countries: Country[] = [
        { name: 'Guinée', code: 'GN', dialCode: '+224', flag: '🇬🇳' },
        { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
        { name: 'Sénégal', code: 'SN', dialCode: '+221', flag: '🇸🇳' },
        { name: 'Mali', code: 'ML', dialCode: '+223', flag: '🇲🇱' },
        { name: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225', flag: '🇨🇮' },
    ];

    constructor() {
        // Set default country
        this.selectedCountry = this.countries[0];
    }

    // Validation methods
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

    // Navigation methods
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

    // Submit registration
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
            // TODO: Call API service to register user
        }
    }

    // Get progress percentage
    getProgress(): number {
        return ((this.currentStep + 1) / 4) * 100;
    }
}