import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UrlForm } from './components/url-form/url-form';
import { UrlList } from './components/url-list/url-list';
import { Url } from './models/url.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UrlForm, UrlList,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  urls = signal<Url[]>([])

  onUrlCreated(newUrl: Url ): void{
    this.urls.update(current =>[newUrl, ...current])
  }

  onUrlDeleted(shortCode:string): void{
    this.urls.update(current => current.filter(url => url.shortCode !== shortCode)
  )
  }

  onUrlUpdated(data : { shortCode: string, newUrl:string}): void{
    this.urls.update(current=> current.map(url => url.shortCode === data.shortCode ? { ...url, url: data.newUrl, updateAt: new Date()}
    :url
    )
  )
  }








}
