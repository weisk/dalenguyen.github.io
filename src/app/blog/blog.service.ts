import { Observable } from 'rxjs'
import * as Butter from 'buttercms'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { captureException } from '@sentry/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  devBaseUrl = 'https://dev.to/api/articles?username=dalenguyen'
  butterService

  get articles() {
    return this.getDevArticles()
  }

  constructor(private http: HttpClient) {
    this.butterService = Butter(environment.butterCMSToken)
  }

  async getDevArticles() {
    let articles: any = []
    try {
      articles = await this.http.get(this.devBaseUrl).toPromise()
    } catch (error) {
      captureException(error)
      console.error(error)
    }

    return articles
  }

  getButterArticles(): Observable<any> {
    return this.butterService.post
      .list({
        page: 1,
        page_size: 10,
        exclude_body: true
      })
      .then(res => {
        console.log('Content from ButterCMS')
        return res.data.data
      })
      .catch(error => {
        captureException(error)
        console.error(error)
        return []
      })
  }

  getButterArticle(slug): Observable<any> {
    return this.butterService.post
      .retrieve(slug, { locale: 'en' })
      .then(res => {
        return res.data.data
      })
      .catch(error => {
        captureException(error)
        return null
      })
  }
}
