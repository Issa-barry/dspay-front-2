import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-send-form',
   standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: './send-form.html',
  styleUrl: './send-form.scss'
})
export class SendForm {
  checked1 = signal<boolean>(true);
}
