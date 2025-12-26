import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-incomplet-widget',
  imports: [],
  templateUrl: './profil-incomplet-widget.html',
  styleUrl: './profil-incomplet-widget.scss'
})
export class ProfilIncompletWidget {
  constructor(
 
  private router: Router
) {}
   goToProfile() {
  this.router.navigate(['/app/profil']);
}
}
