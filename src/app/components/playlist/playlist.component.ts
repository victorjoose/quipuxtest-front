import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Playlist, PlaylistRequest } from '../../models/playlist.model';
import { PlaylistService } from 'src/app/services/playlist.service';
import { MusicaService } from 'src/app/services/musica.service';
import { Musica } from 'src/app/models/musica.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit {
  @ViewChild('searchDialog') searchDialog!: ElementRef<HTMLDialogElement>;
  searchTitle = '';
  searchedPlaylist: Playlist = new Playlist();
  musicas: Musica[] = [];
  selectedSongs: Musica[] = [];

  showDropdown: boolean = false;

  newPlaylistReq: PlaylistRequest = {
    nome: '',
    descricao: '',
    musicasIds: [],
  };

  newPlaylist: Playlist = {
    nome: '',
    descricao: '',
    musicas: [],
    musicasIds: [],
  };

  playlists: Playlist[] = [];
  informNameWarning = false;
  showFilters = false;
  nameFilter = '';
  playlistNaoEncontrada = false;

  constructor(
    private playlistService: PlaylistService,
    private musicaService: MusicaService
  ) {}

  ngOnInit(): void {
    this.loadMusicas();
    this.loadPlaylists();
  }

  clearData(): void {
    this.newPlaylist = {
      nome: '',
      descricao: '',
      musicas: [],
      musicasIds: [],
    };
  }

  addPlaylist(): void {
    if (!this.checkName(this.newPlaylistReq.nome)) {
      return;
    }

    console.log(this.newPlaylistReq.musicasIds);

    this.selectedSongs.forEach((e) => {
      if (e.id) {
        this.newPlaylistReq.musicasIds.push(e.id);
      }
    });

    this.playlistService.createPlaylist(this.newPlaylistReq).subscribe(
      () => {
        this.loadPlaylists();
        this.clearData();
        localStorage.setItem('unauthorized', 'false');
      },
      (error) => {
        if (error.status === 401) {
          localStorage.setItem('unauthorized', 'true');
        }
      }
    );
  }

  selectSong(musica: Musica): void {
      if (!this.isSelected(musica)) {
        this.selectedSongs.push(musica);
      } else {
        this.selectedSongs = this.selectedSongs.filter(
          (song) => song.id !== musica.id
        );
      }
  }

  isSelected(musica: Musica): boolean {
    return this.selectedSongs.some((song) => song.id === musica.id);
  }

  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe((data: Playlist[]) => {
      this.playlists = data;
    });
  }

  loadMusicas(): void {
    this.musicaService.getMusicas().subscribe((data: Musica[]) => {
      this.musicas = data;
    });
  }

  deletePlaylist(playlist: Playlist): void {
    if (playlist.nome) {
      this.playlistService.deletePlaylist(playlist.nome).subscribe(
        () => {
          this.loadPlaylists();
          localStorage.setItem('unauthorized', 'false');
        },
        (error) => {
          if (error.status === 401) {
            localStorage.setItem('unauthorized', 'true');
          }
        }
      );
    }
  }

  openSearchModal() {
    this.playlistNaoEncontrada = false;
    this.searchDialog.nativeElement.showModal();
  }

  closeSearchModal() {
    this.searchDialog.nativeElement.close();
  }

  search() {
    if (this.searchTitle) {
      this.playlistService.getPlaylist(this.searchTitle).subscribe(
        (result: Playlist) => {
          this.searchedPlaylist = result;
        },
        (error: any) => {
          if (error.status === 404) {
            this.playlistNaoEncontrada = true
          }
        }
      );
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters === false) {
      this.clearFilters();
    }
  }

  get filteredPlaylists(): Playlist[] {
    return this.playlists.filter((playlist) => {
      const nameMatch =
        !this.nameFilter ||
        playlist.nome.toLowerCase().includes(this.nameFilter.toLowerCase());
      return nameMatch;
    });
  }

  clearFilters(): void {
    this.nameFilter = '';
  }

  checkName(nome: string) {
    if (nome.length === 0) {
      this.informNameWarning = true;
      setTimeout(() => {
        this.informNameWarning = false;
      }, 5000);
      return false;
    } else {
      this.informNameWarning = false;
      return true;
    }
  }
}
