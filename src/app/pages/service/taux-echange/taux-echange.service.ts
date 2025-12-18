import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environements/environment.dev';

type ApiResponse<T> = { success: boolean; message: string; data: T };

export type TauxEchangeLite = {
  id: number;
  taux: number; // entier ex: 9500, 10700
};

@Injectable({
  providedIn: 'root'
})
export class TauxEchangeService {
    private readonly baseUrl = `${environment.apiUrl}/taux`;

  constructor(private http: HttpClient) {}

  /** Exemple: GET /taux-echanges/current */
// taux-echange.service.ts
getCurrent() {
  return this.http
    .get<ApiResponse<any[]>>(`${this.baseUrl}/all`)
    .pipe(
      map((res) => {
        if (!res.data || res.data.length === 0) {
          throw new Error('Aucun taux disponible');
        }

        // 🔥 règle métier simple : dernier taux actif
        const taux = res.data[res.data.length - 1];

        return {
          id: Number(taux.id),
          taux: Number(taux.taux),
        };
      })
    );
}

}
