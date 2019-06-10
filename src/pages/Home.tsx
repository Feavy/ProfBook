import { IonContent, IonImg, IonButton} from '@ionic/react';
import React from 'react';

import './Home.css';

import firebase from "firebase";

import { History } from 'history';

class Home extends React.Component<{history:History}, {}> {
  constructor(props:{history:History}) {
    super(props);
    
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.history.replace('/main');
      }
    });
  }
  render() {
    const {history} = this.props;
    return (
      <>
        <IonImg id="profbookIcon" src="/assets/icon/icon.png" />
        <IonContent padding>
         <h1 className="title">ProfBook</h1>
         <IonButton style={{marginTop: "15vh"}} class="button" color="primary" onClick={() => {
           history.push('/connexion');
         }}>Connexion</IonButton>
        </IonContent>
      </>
    );
  }
}

export default Home;