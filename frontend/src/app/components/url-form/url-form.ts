import { Component, inject, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {UrlService} from '../../services/url.service';
import {Url} from '../../models/url.interface';

@Component({
  selector: 'app-url-form',
  imports: [FormsModule],
  templateUrl: './url-form.html',
  styleUrl: './url-form.css',
})
export class UrlForm {
  private urlService = inject(UrlService)

  urlInput = signal<string>('')
  loading = signal<boolean>(false)
  error = signal<string | null>(null)

  urlCreated= output<Url>()

  onSubmit(): void{
    const url = this.urlInput().trim()


    if(!url){
      this.error.set('Por favor ingrese una URL')
      return
    }

    this.loading.set(true)
    this.error.set(null)

    this.urlService.CreateShortUrl(url).subscribe({
      next:(newUrl: Url) =>{
        console.log('URL CREADA', newUrl)
        this.urlCreated.emit(newUrl)
        this.urlInput.set('')
        this.loading.set(false)
      },
      error:(err: Error)=>{
        console.error('Error al crear URL', err);
        this.error.set(err.message);
        this.loading.set(false)
        
        
      }


    })



  }









}
