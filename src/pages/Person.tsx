import { IonContent, IonHeader, IonToolbar, IonImg, IonIcon, IonSelect, IonItem, IonLabel, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonAvatar, IonTitle, IonNav, IonBackButton } from '@ionic/react';
import React from 'react';

import './Main.css';


const Person: React.SFC<any> = ({ history }) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonBackButton style={{float:"left", width: "50px", margin: "8px .5em 0 .5em"}} goBack={() => console.log("back")}/>
          <h1>ProfBook</h1>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div id="profilContainer">
          <IonImg src="/assets/icon/test.jpg" class="avatar"/>
          <div style={{textAlign: "center"}}>
              <h1 style={{display: "inline"}}>Quentin Gendarme</h1>
              <h3 style={{display: "inline", fontStyle: "italic"}}> (QG)</h3>
              <h5>Enseignant-Chercheur</h5>
          </div>
          <h3>Formation :</h3>
          <p className="info">DUT</p>
          <h3>Modules :</h3>
          <p className="info">IAP, POO, AMN</p>
          <h3>Descriptif :</h3>
          <p className="info">
            Ceci est le court descriptif de ma personne. Comme je ne sais pas trop quoi dire je me content d'écrire des choses sans intérêt comme ceci, et je ne sais pas pendant combien de temps je vais pouvoir tenir comme ça. Mais ce n'est pas grave puisque je pense que cela va suffire pour l'exemple.
          </p>
        </div>
      </IonContent>
        
    </>
  );
};

export default Person;