export interface Musica {
    id?: string;
    titulo: string;
    artista: string;
    album: string;
    ano: number;
    genero: string;    
}
  
export class Musica {
    constructor(
      public titulo: string = '',
      public artista: string = '',
      public album: string = '',
      public ano: number = 0,
      public genero: string = ''
    ) {}
}