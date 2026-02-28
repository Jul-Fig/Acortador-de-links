import { Component, signal, output,input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Url } from '../../models/url.interface';
import { UrlService } from '../../services/url.service';

@Component({
  selector: 'app-url-item',
  imports: [FormsModule, DatePipe],
  templateUrl: './url-item.html',
  styleUrl: './url-item.css',
})
export class UrlItem {
  private urlService = inject(UrlService)

  url=input.required<Url>()


deleted=output<string>()
updated=output<{shortCode:string; newUrl:string}>()

isEditing = signal<boolean>(false)
editUrl = signal<string>('')
loading = signal<boolean>(false)

get shortUrl():string {
  return `http://localhost:3000/${this.url().shortCode}`
}

startEdit(): void{
  this.isEditing.set(true)
  this.editUrl.set(this.url().url)
}

cancelEdit(): void{
  this.isEditing.set(false)
  this.editUrl.set('')
}

saveEdit(): void{
  const newUrl=this.editUrl().trim()

  if(!newUrl || newUrl== this.url().url){
    return this.cancelEdit()
  }
  this.loading.set(true)

  this.urlService.updateUrl(this.url().shortCode, newUrl).subscribe({
    next: ()=>{
      this.updated.emit({shortCode: this.url().shortCode, newUrl})
      this.isEditing.set(false)
      this.loading.set(false)
    },
    error:(err: Error)=>{
      console.error('Error al actualizar', err);
      alert(`Error: ${err.message}`)
      this.loading.set(false)
    }
  })
}

deletedUrl():void{
if (!confirm('¿Estás seguro de eliminar esta URL?')){
  return
}
this.loading.set(true)

this.urlService.deleteUrl(this.url().shortCode).subscribe({
  next:()=>{
    this.deleted.emit(this.url().shortCode)
  },
  error: (err: Error)=> {
    console.error('Error al eliminar', err);
    alert(`Error: ${err.message}`)
    this.loading.set(false)
  }
})
}

copyToClipboard(): void{
  navigator.clipboard.writeText(this.shortUrl).then(()=>{
    alert('URL copiada al portapapeles')
  })
}

}
