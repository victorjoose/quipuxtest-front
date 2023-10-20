import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Musica } from '../models/musica.model';

@Injectable({
  providedIn: 'root',
})
export class MusicaService {
  private apiUrl = 'http://localhost:8080/musicas';
  searchedMusica!: Musica;

  constructor(private http: HttpClient) {}

  getMusicas(): Observable<Musica[]> {
    return this.http.get<Musica[]>(this.apiUrl);
  }

  getMusica(titulo: string): Observable<Musica> {
    const url = `${this.apiUrl}/search/${titulo}`;
    return this.http.get<Musica>(url).pipe(
      tap((result) => {
        this.searchedMusica = result;
      })
    );
  }

  createMusica(musica: Musica): Observable<Musica> {
    const url = `${this.apiUrl}/new`;
    return this.http.post<Musica>(url, musica);
  }

  deleteMusica(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
