import { Musica } from './musica.model';

export interface Playlist {
  id?: number;
  nome: string;
  descricao: string;
  musicas: Musica[];
  musicasIds: string[]
}

export interface PlaylistRequest {
  nome: string;
  descricao: string;
  musicasIds: string[]
}


export class Playlist {
  constructor(
    public nome: string = '',
    public descricao: string = '',
    public musicas: Musica[] = [],
    public musicasIds: string[] = []
  ) {}

}