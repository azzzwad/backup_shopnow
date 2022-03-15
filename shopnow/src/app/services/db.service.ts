import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Injectable()
export class DbService {
  constructor() {}

  async save(collection: string, id: string, obj: any) {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    const collectionReference = firebase.firestore().collection(collection);
    try {
      let data;
      data = await collectionReference
        .doc(id)
        .set(obj)
        .then((res) => {
          return { Success: true, Message: 'Successfully saved' };
        })
        .catch((error) => {
          return { Success: false, Message: error };
        });
      return data;
    } catch (err) {
      return { Success: false, Message: err };
    }
  }

  async update(collection: string, id: string, obj: any) {
    const collectionReference = firebase.firestore().collection(collection);
    try {
      let data;
      data = await collectionReference
        .doc(id)
        .update(obj)
        .then((res) => {
          return { Success: true, Message: 'Successfully updated' };
        })
        .catch((error) => {
          return { Success: false, Message: error };
        });
      return data;
    } catch (err) {
      return { Success: false, Message: err };
    }
  }

  async delete(collection: string, id: string) {
    const collectionReference = firebase.firestore().collection(collection);
    try {
      let data;
      data = await collectionReference
        .doc(id)
        .delete()
        .then((res) => {
          return { Success: true, Message: 'Successfully deleted' };
        })
        .catch((error) => {
          return { Success: false, Message: error };
        });
      return data;
    } catch (err) {
      return { Success: false, Message: err };
    }
  }

  async getDocumentDetails(collection: string, id: string) {
    const collectionReference = firebase.firestore().collection(collection);
    try {
      let doc = await collectionReference.doc(id).get();
      if (doc.data()) {
        return { Success: true, Data: doc.data() };
      } else {
        return { Success: false, Message: 'No details found' };
      }
    } catch (err) {
      return { Success: false, Message: err };
    }
  }

  async getDocuments(collection: string, limit: number) {
    const collectionReference = firebase.firestore().collection(collection);
    try {
      let data = [];
      let docSnap = await collectionReference.limit(limit).get();
      for (let doc of docSnap.docs) {
        data.push(doc.data());
      }
      return { Success: true, Data: data };
    } catch (err) {
      return { Success: false, Data: err };
    }
  }

  async getThumbnails(collection: string, limit: number) {
    const collectionReference = firebase
      .firestore()
      .collection(collection)
      .orderBy('postedOn', 'desc');
    try {
      let data = [];
      let docSnap = await collectionReference.limit(limit).get();
      for (let doc of docSnap.docs) {
        data.push(doc.data());
      }
      return { Success: true, Data: data };
    } catch (err) {
      return { Success: false, Data: err };
    }
  }
}
