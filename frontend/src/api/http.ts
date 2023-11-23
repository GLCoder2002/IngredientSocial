import { SERVER_ENDPOINT } from './server-url'
import axios from 'axios'

export const LOCALSTORAGE = {
  USER: 'user',
  CREDENTIALS: 'credentials',
}
export class Http {
  // constructor() { }

  static _getHeader() {
    const credentials = JSON.parse(localStorage.getItem(LOCALSTORAGE.CREDENTIALS) || '{}');

    return {
      Authorization: `Bearer ${credentials?.token || ''}`,
    }
  }
  static get = (endPoint: any, params?: any) => {
    const options = {
      headers: this._getHeader(),
      params: {},
    }
    if (params && Object.keys(params).length) {
      options.params = params
    }
    return axios.get(SERVER_ENDPOINT + endPoint, options)
  }
  static post = (endPoint: string, payload: any) => {
    return axios.post(SERVER_ENDPOINT + endPoint, payload, {
      headers: this._getHeader(),
    })
  }

  static put = (endPoint: string, payload: any) => {
    return axios.put(SERVER_ENDPOINT + endPoint, payload, {
      headers: this._getHeader(),
    })
  }

  static patch = (endPoint: string, payload: any) => {
    return axios.patch(SERVER_ENDPOINT + endPoint, payload, {
      headers: this._getHeader(),
    })
  }

  static delete = (endPoint: string, id: any) => {
    return axios.delete(SERVER_ENDPOINT + endPoint + '/' + id, {
      headers: this._getHeader(),
    })
  }
}
