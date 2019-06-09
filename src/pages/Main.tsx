import { IonContent, IonHeader, IonToolbar, IonImg, IonIcon, IonSelect, IonItem, IonLabel, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonAvatar, IonTitle, IonNav, IonBackButton } from '@ionic/react';
import React from 'react';

import './Main.css';

const Main: React.SFC<any> = ({history}) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonImg src="/assets/icon/icon.png" style={{ width: "50px", float: "left", marginRight: "1em" }} />
          <IonIcon name="person" style={{ float: "right", fontSize: "50px", margin: "5px 5px 0px 0px" }} />
          <h1>ProfBook</h1>
        </IonToolbar>
        <>
          <IonGrid id="test">
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Module</IonLabel>
                  <IonSelect multiple={false} interface="popover" value="all">
                    <IonSelectOption value="all">Tous</IonSelectOption>
                    <IonSelectOption value="iap">IAP</IonSelectOption>
                    <IonSelectOption value="apr">APR</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Formation</IonLabel>
                  <IonSelect interface="popover" value="all">
                    <IonSelectOption value="all">Tous</IonSelectOption>
                    <IonSelectOption value="dut">DUT</IonSelectOption>
                    <IonSelectOption value="lp">LP</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </>
      </IonHeader>
          
      <IonContent>
        <IonList id="peopleList">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => 
            <IonItem class="profilItem" key={x} onClick={() => {
              history.push("/main/person", {id: x})
            }}>
              <IonAvatar slot="start" style={{ float: "left", marginRight: "1em" }}>
                <img src="/assets/icon/test.jpg" />
              </IonAvatar>
              <IonLabel>
                <h2 style={{ display: "inline", fontWeight: "bold" }}>Quentin Gendarme</h2><h3 style={{ display: "inline" }}> (QG)</h3>
                <h2 style={{float: "right"}}>DUT</h2><br/>
                <p style={{ fontStyle: "italic", display: "inline" }}>IAP, APR, POO</p>
                <p style={{display: "inline", fontSize: "10px", float: "right", position: "relative", left: "3.5em"}}>Enseignant-Chercheur</p>
                <p>Élève à l'IUT de Blagnac dans le département informatique.</p>
              </IonLabel>
            </IonItem>
          )}
          
        </IonList>
      </IonContent>
        
    </>
  );
};

export default Main;