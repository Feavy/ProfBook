import { IonContent, IonImg, IonButton} from '@ionic/react';
import React from 'react';

import './Home.css';

const Home: React.SFC<any> = ({history}) => {
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
};

export default Home;