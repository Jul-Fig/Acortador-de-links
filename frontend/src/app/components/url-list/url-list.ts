import { Component, input, output } from '@angular/core';
import { Url } from '../../models/url.interface';
import { UrlItem } from '../../components/url-item/url-item'
@Component({
  selector: 'app-url-list',
  standalone: true,
  imports: [UrlItem],
  templateUrl: './url-list.html',
  styleUrl: './url-list.css'
})
export class UrlList {
  urls = input.required<Url[]>()


  urlDeleted = output<string>()
  urlUpdated = output<{shortCode: string; newUrl:string}>()

  onDelete(shortCode: string): void{
    this.urlDeleted.emit(shortCode)
  }


  onUpdated(data:{shortCode:string, newUrl:string}):void{
    this.urlUpdated.emit(data)
  }
}
