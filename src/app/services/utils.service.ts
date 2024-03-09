import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl= inject(LoadingController);
  toastCtrl = inject(ToastController)
  router = inject(Router);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);

  async takePicture(){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Agrega una imagen',
      promptLabelPhoto: 'Selecciona una Imagen',
      promptLabelPicture: 'Tomar una Foto',
    });

  };

  //------ alerta ------
  async presentAlert(opts?: AlertOptions){
    const alert = await this.alertCtrl.create(opts);

    await alert.present();
  }

  // --Loading--
  loading(){
    return this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'crescent'
    });
  }

  // --Toast--

  async presentToast(opts?: ToastOptions){
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // --Enruta a cualquier pagina Disponible--
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

  // --Guarda un elemento en LocalStorage--

  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));  
  }

  // --Obtiene un elemento de LocalStorage-- 
  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }


  //--- Modal ---
  async presentModal(opts: ModalOptions){
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data){
      return data;
    }
  }

  dismissModal(data?: any){
    this.modalCtrl.dismiss(data);
  }

}
