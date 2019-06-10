import { IonContent, IonHeader, IonToolbar, IonImg, IonIcon, IonSelect, IonItem, IonLabel, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonAvatar, IonTitle, IonNav, IonBackButton } from '@ionic/react';
import React from 'react';

import './Main.css';

import {History} from 'history';

import PersonData from '../data/Person';

class Person extends React.Component<{history:History}, {}> {
  private person:PersonData;
  
  constructor(props:{history:History}) {
    super(props);

    console.log(history);

    if(history.state.state)
      this.person = history.state.state.person;
    else
      this.person = new PersonData("", "", "", "", "", "", "", [], "");
    console.log(this.person);
  }
  render() {
    const {history} = this.props;
    const p = this.person;
    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonBackButton style={{float:"left", width: "50px", margin: "8px .5em 0 .5em"}} goBack={() => console.log("back")}/>
            <IonIcon onClick={e => history.push('/main/person/editor', {person: this.person})} class="iconButton" style={{ float: "right", fontSize: "50px", margin: "5px 5px 0px 0px" }} name="create"/>
            <h1>ProfBook</h1>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          <div id="profilContainer">
            <IonImg src={p.avatar || "data:image/png;base64,    "} class="avatar"/>
            <div style={{textAlign: "center"}}>
                <h1 style={{display: "inline"}}>{p.prenom + " " + p.nom}</h1>
                <h3 style={{display: "inline", fontStyle: "italic"}}> ({p.initiales})</h3>
                <h5>{p.fonction}</h5>
            </div>
            <h3>Formation :</h3>
            <p className="info">{p.formation}</p>
            <h3>Modules :</h3>
            <p className="info">{p.modules.join(", ")}</p>
            <h3>Descriptif :</h3>
            <p className="info">{p.description}</p>
          </div>
        </IonContent>
          
      </>
    );
  }
}

export default Person;