import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PlaylistComponent } from './components/playlist/playlist.component';

import { BrowserModule } from '@angular/platform-browser';
import { MusicaComponent } from './components/musica/musica.component';
import { AuthInterceptor } from './components/interceptor/authInterceptor';

const appRoutes: Routes = [
  {path: '', component: MusicaComponent},
  {path: 'playlists', component: PlaylistComponent},
  {path: 'about', component: AboutComponent}
 ]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    MusicaComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
