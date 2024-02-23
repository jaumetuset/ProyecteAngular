import { FilterService } from './../../services/filter.service';
import { IArtwork } from './../../interfaces/i-artwork';
import { Component, OnInit,Input } from '@angular/core';
import { ArtworkComponent } from '../artwork/artwork.component';
import { ArtworkRowComponent } from '../artwork-row/artwork-row.component';
import { ApiServiceService } from '../../services/api-service.service';
import { ArtworkFilterPipe } from '../../pipes/artwork-filter.pipe';
import { debounceTime, filter } from 'rxjs';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [ArtworkComponent, ArtworkRowComponent,ArtworkFilterPipe],
  templateUrl: './artwork-list.component.html',
  styleUrl: './artwork-list.component.css'
})
export class ArtworkListComponent implements OnInit{

  /**
   - constuctora -> injecte el service que necesita de la clase ApiServiceService

   - injeccció de dependencies fan automaticamente la instancia del this de TypeScript
     y es autoconstruible ( this.artService = artService )

   - component cuan siga creat li demane els cuadres al service

   - cicle de vida dels components a través de funcions (51)

   - conectar amb ngOnInit : conecxió de forma asyncrona

   - correcte funcionament a partir del servidor

   */

  constructor(private artService: ApiServiceService,private filterService: FilterService, private usesService: UsersService){}

  /*
    - ngOnInit(): obté dades del servidor
    - rebre les dades de la url
    - subcribirse per a extreure les obres de art
    - a : artworks
    - el component se subscriu al service que li dona quadres , en esta funcio arreplega el array de artworks y els mostra els 12 quadres que venen de la api
    - se li pasa un filtre que sino posa els 4 caracters no filtrará per subscriures
  */
  ngOnInit(): void {
    //this.quadres = this.artService.quadres;
    console.log(this.onlyFavorites);

    if(this.onlyFavorites != 'favorites'){
      this.artService.getArtWorks().pipe(
        // demanar i marcar les favorites
      )
        .subscribe((artworkList: IArtwork[]) => this.quadres = artworkList);
    }
    else {
      // Demanar les favorites
      this.artService.getArtWorksIds(['3752', '11294', '6010'])
        .subscribe((artworkList: IArtwork[]) => this.quadres = artworkList);
    }

    this.artService.getArtWorks()
    .subscribe((artworkList: IArtwork[]) => this.quadres = artworkList);
    this.filterService.searchFilter.pipe(filter(f => f.length > 4 || f.length === 0),debounceTime(500)).subscribe(filter => this.filter = filter);
  }

  toggleLike($event: boolean, artwork: IArtwork){
    console.log($event,artwork);
    artwork.like = !artwork.like;
    this.usesService.setFavorite(artwork.id + "")
  }

  quadres: IArtwork[]=[];
  filter: string='';
  @Input() onlyFavorites: string = '';
}



