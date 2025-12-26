import { Component } from '@angular/core';

@Component({
    standalone: true,
    imports: [],
    selector: 'app-footer',
    template: `<div class="layout-footer">
        DIAMA
        <a href="https://primeng.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">MONEY</a>
                                <span class="text-base text-surface-900 dark:text-surface-0 font-normal leading-normal">© 2026, Inc</span>

    </div>`
})
export class AppFooter {}
