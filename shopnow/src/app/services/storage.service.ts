import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import firebase from 'firebase';

@Injectable()
export class StorageService {
  constructor() {}


  async uploadImageFileAndGetUrl(file: File) {
    try {

      let path = "images/" + Date.now().toString();
      const storageRef = firebase.storage().ref();
      // Create the file metadata
      const metadata = {
        contentType: "image/*"
      };

      const fileRef = storageRef.child(path);

      const uploadTaskSnapshot = await fileRef.put(file, metadata);

      const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

      if(downloadURL.startsWith('http')){
        return {Success:true,Data:downloadURL};
      }else{
        return {Success:false,Data:'Upload unsuccessful'};
      }

    } catch (e) {
      return {Success: false, Data: e}
    }
  }
}
