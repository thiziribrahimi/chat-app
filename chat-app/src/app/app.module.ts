import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Ajoutez RouterModule pour le routage
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent // AppComponent doit être le point d'entrée principal
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot([
      { path: 'chat', loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent) },
      { path: '', redirectTo: 'chat', pathMatch: 'full' }
    ]) // Configurez les routes pour ChatComponent
  ],
  bootstrap: [AppComponent] // Utilisez AppComponent ici
})
export class AppModule {}
