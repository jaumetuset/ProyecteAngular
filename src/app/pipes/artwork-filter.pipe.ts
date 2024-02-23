import { Pipe, PipeTransform } from '@angular/core';
import { IArtwork } from '../interfaces/i-artwork';

@Pipe({
  name: 'artworkFilter',
  standalone: true
})
export class ArtworkFilterPipe implements PipeTransform {

  transform(artworks: IArtwork[], filter: string): IArtwork[] {
    return artworks.filter(aw =>ng : El término 'ng' no se reconoce como nombre de un cmdlet, función, archivo de script o programa ejecutable.
    Compruebe si escribió correctamente el nombre o, si incluyó una ruta de acceso, compruebe que dicha ruta es
    correcta e inténtelo de nuevo.
    En línea: 1 Carácter: 1
    + ng serve -o
    + ~~
        + CategoryInfo          : ObjectNotFound: (ng:String) [], CommandNotFoundException
        + FullyQualifiedErrorId : CommandNotFoundException
      aw.title.toLowerCase().includes(filter.toLowerCase()) ||
      aw.description?.toLocaleLowerCase().includes(filter.toLowerCase()));
  }

}
