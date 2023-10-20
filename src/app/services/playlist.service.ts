import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist, PlaylistRequest } from '../models/playlist.model';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private apiUrl = 'http://localhost:8080/lists';

  constructor(private http: HttpClient) {}

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.apiUrl);
  }

  createPlaylist(Playlist: PlaylistRequest): Observable<Playlist> {
    return this.http.post<Playlist>(this.apiUrl, Playlist);
  }

  deletePlaylist(listName: string): Observable<void> {
    const url = `${this.apiUrl}/${listName}`;
    return this.http.delete<void>(url);
  }

  getPlaylist(listName: string): Observable<Playlist> {
    const url = `${this.apiUrl}/search/${listName}`;
    return this.http.get<Playlist>(url);
  }
}
