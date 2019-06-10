import { IonContent, IonImg, IonButton, IonInput, IonItem, IonLabel, IonGrid, IonRow } from '@ionic/react';
import React from 'react';

import {History} from 'history';

import firebase from "firebase";

interface Props {
  history:History;
}

interface State {
  email:string;
  password:string;
}

class Connexion extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {email: "", password: ""};
    this.updateLogin = this.updateLogin.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  connect() {
    const {email, password} = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error:any) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error : "+errorMessage);
      // ...
    }).then(e => {
      console.log(firebase.auth().currentUser)
      if(firebase.auth().currentUser)
        this.props.history.push('/main');
    });
  }

  updateLogin(e:CustomEvent<KeyboardEvent>) {
    var input:HTMLIonInputElement = e.target as HTMLIonInputElement;
    if(input.value)
      this.setState({email: input.value});
  }

  updatePassword(e:CustomEvent<KeyboardEvent>) {
    var input:HTMLIonInputElement = e.target as HTMLIonInputElement;
    if(input.value)
      this.setState({password: input.value});
  }

  render() {
    const history = this.props.history;
    const {email, password} = this.state;
    console.log(this.state);
    return (
      <>
        <IonImg id="profbookIcon" src="/assets/icon/icon.png" />
        <IonContent>
          <IonGrid>
            <IonRow justify-content-center>
             <h1 className="title">ProfBook</h1>
           </IonRow>
           <IonRow justify-content-center>
             <h2>Connectez-vous</h2>
           </IonRow>
           <IonRow justify-content-center>
            <IonItem>
              <IonLabel position="stacked">Login :</IonLabel>
              <IonInput type="email" value={email} onIonInput={this.updateLogin}/>
            </IonItem>
          </IonRow>
          <IonRow justify-content-center>
            <IonItem>
              <IonLabel position="stacked">Mot de passe :</IonLabel>
              <IonInput type="password" clearOnEdit={false} value={password} onIonInput={this.updatePassword}/>
            </IonItem>
          </IonRow>
          <IonRow justify-content-center>
            <IonButton color="primary" style={{marginTop: "30px"}} onClick={() => {
              this.connect();
            }}>Connexion</IonButton>
          </IonRow>
          </IonGrid>
        </IonContent>
      </>
    );
  }
}

export default Connexion;