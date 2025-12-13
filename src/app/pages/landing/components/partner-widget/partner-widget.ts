import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PaymentPartner {
    name: string;
    logo: string;
    bgColor: string;
    textColor?: string;
    gridPosition: string;
}

@Component({
    selector: 'app-partner-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './partner-widget.html',
    styleUrl: './partner-widget.scss'
})
export class PartnerWidget {
    partners: PaymentPartner[] = [
        { 
            name: 'VISA', 
            logo: 'VISA', 
            bgColor: '#FFFFFF',
            textColor: '#1A1F71',
            gridPosition: 'grid-area: 1 / 1 / 2 / 2;'
        },
        { 
            name: 'ALAT', 
            logo: 'ALAT', 
            bgColor: '#FFFFFF',
            textColor: '#C41E3A',
            gridPosition: 'grid-area: 1 / 3 / 2 / 4;'
        },
        { 
            name: 'KS-PAY', 
            logo: 'KS-PAY', 
            bgColor: '#FFFFFF',
            textColor: '#00457C',
            gridPosition: 'grid-area: 2 / 2 / 3 / 3;'
        },
        { 
            name: 'Orange Money', 
            logo: 'Orange Money', 
            bgColor: '#FF6600',
            textColor: '#FFFFFF',
            gridPosition: 'grid-area: 3 / 1 / 4 / 2;'
        },
        { 
            name: 'PAYCARD', 
            logo: 'PAYCARD', 
            bgColor: '#FFFFFF',
            textColor: '#635BFF',
            gridPosition: 'grid-area: 4 / 3 / 5 / 4;'
        },
        // Placeholders gris
        { 
            name: '', 
            logo: '', 
            bgColor: '#E5E7EB',
            gridPosition: 'grid-area: 1 / 2 / 2 / 3;',
            textColor: ''
        },
        { 
            name: '', 
            logo: '', 
            bgColor: '#E5E7EB',
            gridPosition: 'grid-area: 2 / 3 / 3 / 4;',
            textColor: ''
        },
        { 
            name: '', 
            logo: '', 
            bgColor: '#E5E7EB',
            gridPosition: 'grid-area: 2 / 1 / 3 / 2;',
            textColor: ''
        },
        { 
            name: '', 
            logo: '', 
            bgColor: '#E5E7EB',
            gridPosition: 'grid-area: 3 / 2 / 4 / 3;',
            textColor: ''
        },
        { 
            name: '', 
            logo: '', 
            bgColor: '#E5E7EB',
            gridPosition: 'grid-area: 3 / 3 / 4 / 4;',
            textColor: ''
        },
        { 
            name: '', 
            logo: '', 
            bgColor: '#E5E7EB',
            gridPosition: 'grid-area: 4 / 1 / 5 / 2;',
            textColor: ''
        },
        { 
            name: '', 
            logo: '', 
            bgColor: '#E5E7EB',
            gridPosition: 'grid-area: 4 / 2 / 5 / 3;',
            textColor: ''
        }
    ];
}