import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { deleteCookie, setCookie } from '../helpers/cookie-utils';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Retailer } from '../models/retailer';
@Injectable()
export class AuthService {
  private loggedIn = new Subject<boolean>();

  constructor() {}

  public setAuth(isLoggedIn: boolean) {
    this.loggedIn.next(isLoggedIn);
  }

  public getLoggedIn() {
    return this.loggedIn.asObservable();
  }

  public async login(email: string, password: string) {
    let response = { Success: false, Message: null };
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    let root = this;
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        if (res.user) {
          let db = firebase.firestore();
          await db
            .collection('users')
            .where('id', '==', res.user.uid)
            .limit(1)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                const userData = doc.data();

                if (userData.role != 'admin') {
                  userData.isEmailVerified = res.user.emailVerified;

                  // root.getUserStatistics(res.user.uid);
                }

                setCookie('_user_session', JSON.stringify(res.user), 720);
                localStorage.setItem('_user_session', JSON.stringify(userData));

                response = { Success: true, Message: userData };
              });
            })
            .catch(function (error) {
              response = { Success: false, Message: error };
            });
        } else {
          response = { Success: false, Message: 'No user found' };
        }
      })
      .catch((ex) => {
        response = { Success: false, Message: ex };
      });

    return response;
  }

  public async signUpWithEmailAndPassword(mobile, email, password, role) {
    let root = this;
    let response = { Success: false, Message: null };
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        if (res.user) {
          let db = firebase.firestore();
          let userObj;
          if (role == 'user') {
            userObj = new User();
          } else {
            userObj = new Retailer();
          }
          userObj.email = email;
          userObj.mobile = mobile;
          userObj.role = role;
          userObj.isEmailVerified = false;
          userObj.id = res.user.uid;
          userObj.profileComplete = false;
          await db
            .collection('users')
            .doc(res.user.uid)
            .set(Object.assign({}, userObj))
            .then(async (result) => {
              setCookie('_user_session', JSON.stringify(res.user), 720);
              localStorage.setItem('_user_session', JSON.stringify(userObj));
              response = { Success: true, Message: userObj };
              // root.setUserStatistics(res.user.uid);
              await res.user.sendEmailVerification();
              // await res.user.updateProfile({displayName:firstName+" "+lastName});
            })
            .catch((error) => {
              response = { Success: false, Message: error };
            });
        }
      })
      .catch((ex) => {
        response = { Success: false, Message: ex };
      });

    return response;
  }

  public async logout() {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    return await firebase
      .auth()
      .signOut()
      .then(() => {
        deleteCookie('_user_session');
        deleteCookie('user_statistics');
        indexedDB.deleteDatabase('hirey_company_db');
        localStorage.removeItem('_user_session');
        localStorage.clear();
        return { Success: true, Message: 'Logged Out' };
      })
      .catch((err) => {
        return { Success: false, Message: err };
      });
  }

  public async endSession() {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
      if (firebase.auth().currentUser) {
        await firebase.auth().signOut();
      }
    }
  }

  public validateEmail(email) {
    // const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const res =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
  }

  async verifyPhoneNumber(phoneNumber, user, appVerifier) {
    var provider = new firebase.auth.PhoneAuthProvider();
    await provider
      .verifyPhoneNumber(phoneNumber, appVerifier)
      .then(function (verificationId) {
        var verificationCode = window.prompt(
          'Please enter the verification ' +
            'code that was sent to your mobile device.'
        );
        let phoneCredential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        user.currentUser.updatePhoneNumber(phoneCredential);
      })
      .then((result) => {
        // Phone credential now linked to current user.
        // User now can sign in with new phone upon logging out.
        console.log(result);
      })
      .catch((error) => {
        // Error occurred.
        console.log(error);
      });
  }

  public async updateUser(user) {
    let response = { Success: false, Message: 'Unable to update user' };
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    try {
      let docRefd = firebase.firestore().collection('users').doc(user.id);
      await docRefd
        .update(Object.assign({}, JSON.parse(JSON.stringify(user))))
        .then(async (result) => {
          await firebase
            .firestore()
            .collection('public_profile')
            .doc(user.id)
            .set(Object.assign({}, JSON.parse(JSON.stringify(user))))
            .then((res) => {
              response = {
                Success: true,
                Message: 'Account successfully updated.',
              };
            })
            .catch((err) => {
              response = { Success: false, Message: err };
            });
        })
        .catch((error) => {
          response = { Success: false, Message: error };
        });
    } catch (e) {
      response = { Success: false, Message: e };
    }
    return response;
  }

  public async resetPassword(email: string) {
    try {
      let response = {
        Success: false,
        Message: 'Unable to send reset request',
      };
      if (!firebase.apps.length) {
        firebase.initializeApp(environment.firebaseConfig);
      }

      await firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(async (res) => {
          response = {
            Success: true,
            Message: 'Password reset link sent to your email',
          };
        })
        .catch((ex) => {
          response = { Success: false, Message: ex };
        });

      return response;
    } catch (e) {
      return { Success: false, Message: e };
    }
  }

  public async signInWithGoogle() {
    let root = this;
    let response = { Success: false, Message: null };
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    let provider = new firebase.auth.GoogleAuthProvider();

    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (res) => {
        if (res.user) {
          let db = firebase.firestore();
          await db
            .collection('users')
            .where('id', '==', res.user.uid)
            .limit(1)
            .get()
            .then(async function (querySnapshot) {
              if (querySnapshot.docs.length > 0) {
                querySnapshot.forEach(function (doc) {
                  const userData = doc.data();
                  setCookie('_user_session', JSON.stringify(res.user), 720);
                  // root.getUserStatistics(res.user.uid);
                  localStorage.setItem(
                    '_user_session',
                    JSON.stringify(userData)
                  );
                  response = { Success: true, Message: userData };
                });
              } else {
                response = {
                  Success: false,
                  Message:
                    'No user found with this google account. Please sign up.',
                };
              }
            })
            .catch(async function (error) {
              response = { Success: false, Message: error };
            });
        } else {
          response = {
            Success: false,
            Message: 'No user found with this google account. Please sign up.',
          };
        }
      })
      .catch((ex) => {
        response = { Success: false, Message: ex };
      });

    return response;
  }

  public async signUpWithGoogle(role: string) {
    let root = this;
    let response = { Success: false, Message: null };
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    let provider = new firebase.auth.GoogleAuthProvider();

    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (res) => {
        if (res.user) {
          let db = firebase.firestore();
          let userObj;
          if (role == 'user') {
            userObj = new User();
            userObj.firstName = res.user.displayName;
          } else {
            userObj = new Retailer();
            userObj.name = res.user.displayName;
          }

          userObj.profileImage = res.user.photoURL;
          userObj.mobile = res.user.phoneNumber;
          userObj.email = res.user.email;
          userObj.role = role;
          userObj.isEmailVerified = true;
          userObj.id = res.user.uid;
          userObj.profileComplete = false;

          await db
            .collection('users')
            .doc(res.user.uid)
            .set(Object.assign({}, userObj))
            .then(async (result) => {
              setCookie('_user_session', JSON.stringify(res.user), 720);
              localStorage.setItem('_user_session', JSON.stringify(userObj));
              // root.setUserStatistics(res.user.uid);
              response = { Success: true, Message: userObj };
              // await res.user.updateProfile({displayName:firstName+" "+lastName});
            })
            .catch((error) => {
              response = { Success: false, Message: error };
            });
        } else {
          response = { Success: false, Message: 'No user found' };
        }
      })
      .catch((ex) => {
        response = { Success: false, Message: ex };
      });

    return response;
  }

  public async signInWithFacebook() {
    let root = this;
    let response = { Success: false, Message: null };
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    let provider = new firebase.auth.FacebookAuthProvider();

    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (res) => {
        if (res.user) {
          let db = firebase.firestore();
          await db
            .collection('users')
            .where('id', '==', res.user.uid)
            .limit(1)
            .get()
            .then(async function (querySnapshot) {
              if (querySnapshot.docs.length > 0) {
                querySnapshot.forEach(function (doc) {
                  const userData = doc.data();
                  setCookie('_user_session', JSON.stringify(res.user), 720);
                  localStorage.setItem(
                    '_user_session',
                    JSON.stringify(userData)
                  );
                  // root.getUserStatistics(res.user.uid);
                  response = { Success: true, Message: userData };
                });
              } else {
                response = {
                  Success: false,
                  Message:
                    'No user found with this facebook account. Please sign up.',
                };
              }
            })
            .catch(async function (error) {
              response = { Success: false, Message: error };
            });
        } else {
          response = {
            Success: false,
            Message:
              'No user found with this facebook account. Please sign up.',
          };
        }
      })
      .catch((ex) => {
        response = { Success: false, Message: ex };
      });

    return response;
  }

  public async signUpWithFacebook(role: string) {
    let root = this;
    let response = { Success: false, Message: null };
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
    let provider = new firebase.auth.FacebookAuthProvider();

    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (res) => {
        if (res.user) {
          let db = firebase.firestore();
          let userObj;
          if (role == 'user') {
            userObj = new User();
            userObj.firstName = res.user.displayName;
          } else {
            userObj = new Retailer();
            userObj.name = res.user.displayName;
          }
          userObj.profileImage = res.user.photoURL;
          userObj.mobile = res.user.phoneNumber;
          userObj.email = res.user.email;
          userObj.role = role;
          userObj.isEmailVerified = true;
          userObj.id = res.user.uid;
          userObj.profileComplete = false;

          await db
            .collection('users')
            .doc(res.user.uid)
            .set(Object.assign({}, userObj))
            .then(async (result) => {
              setCookie('_user_session', JSON.stringify(res.user), 720);
              localStorage.setItem('_user_session', JSON.stringify(userObj));
              // root.setUserStatistics(res.user.uid);
              response = { Success: true, Message: userObj };
              // await res.user.updateProfile({displayName:firstName+" "+lastName});
            })
            .catch((error) => {
              response = { Success: false, Message: error };
            });
        } else {
          response = { Success: false, Message: 'No user found' };
        }
      })
      .catch((ex) => {
        response = { Success: false, Message: ex };
      });

    return response;
  }
}
