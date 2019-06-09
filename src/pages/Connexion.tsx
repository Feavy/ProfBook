import { IonContent, IonImg, IonButton, IonInput, IonItem, IonLabel, IonGrid, IonRow } from '@ionic/react';
import React from 'react';

const Connexion: React.SFC<any> = ({history}) => {
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
            <IonInput type="text"/>
          </IonItem>
        </IonRow>
        <IonRow justify-content-center>
          <IonItem>
            <IonLabel position="stacked">Mot de passe :</IonLabel>
            <IonInput type="password" />
          </IonItem>
        </IonRow>
        <IonRow justify-content-center>
          <IonButton color="primary" style={{marginTop: "30px"}} onClick={() => {
            history.push('/main');
          }}>Connexion</IonButton>
        </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};

export default Connexion;