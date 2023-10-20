import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Musica } from '../../models/musica.model';
import { MusicaService } from 'src/app/services/musica.service';

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.css'],
})
  
export class MusicaComponent implements OnInit {
  @ViewChild('searchDialog') searchDialog!: ElementRef<HTMLDialogElement>;
  searchTitle = '';
  searchedMusica: Musica = new Musica();
  musicaNaoEncontrada = false;

  newMusica: Musica = {
    titulo: '',
    artista: '',
    album: '',
    ano: 0,
    genero: '',
  };

  musicas: Musica[] = [];
  informTitleWarning = false;
  showFilters = false;
  artistaFilter = '';
  unauthorized = true;

  constructor(private musicaService: MusicaService) { }

  ngOnInit(): void {
    this.loadMusicas();
  }

  clearData(): void {
    this.newMusica = {
      id: '',
      titulo: '',
      artista: '',
      album: '',
      ano: 0,
      genero: '',
    };
  }

  addMusica(): void {
    if (!this.checkTitle(this.newMusica.titulo)) {
      return;
    }
  
    this.musicaService.createMusica(this.newMusica).subscribe(
      () => {
        this.loadMusicas();
        this.unauthorized = false
        localStorage['setAuthorized'](this.unauthorized)
        this.clearData();
      },
      (error) => {
        if (error.status === 401) {
          this.unauthorized = true
        }
        localStorage['setAuthorized'](this.unauthorized)
      }
    );
  }

  loadMusicas(): void {
    this.musicaService.getMusicas().subscribe((data: Musica[]) => {
      this.musicas = data;
    });
  }

  deleteMusica(musica: Musica): void {
    if (musica.id) {
      this.musicaService.deleteMusica(musica.id).subscribe(
        () => {
          this.loadMusicas();
          this.unauthorized = false
          localStorage['setAuthorized'](this.unauthorized)
        },
        (error) => {
          if (error.status === 401) {
            this.unauthorized = true
          } 
          localStorage['setAuthorized'](this.unauthorized)
        }
      );
      
    }
  }

  openSearchModal() {
    this.musicaNaoEncontrada = false;
    this.searchDialog.nativeElement.showModal()
  }

  closeSearchModal() {
    this.searchDialog.nativeElement.close();

  }

  search() {
    if (this.searchTitle) {
      this.musicaService.getMusica(this.searchTitle).subscribe(
        (result: Musica) => {
          this.searchedMusica = result;
        },
        (error: any) => {
          this.musicaNaoEncontrada = true;
        }
      );
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters === false) {
      this.clearFilters();
    }
  }

  get filteredArtistas(): Musica[] {
    return this.musicas.filter((musica) => {
      const titleMatch =
        !this.artistaFilter ||
        musica.artista.toLowerCase().includes(this.artistaFilter.toLowerCase());
      return titleMatch;
    });
  }

  clearFilters(): void {
    this.artistaFilter = '';
  }

  checkTitle(titulo: string) {
    if (titulo.length === 0) {
      this.informTitleWarning = true;
      setTimeout(() => {
        this.informTitleWarning = false;
      }, 5000);
      return false;
    } else {
      this.informTitleWarning = false;
      return true;
    }
  }
}
