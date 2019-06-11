import { IonContent, IonHeader, IonToolbar, IonImg, IonIcon, IonSelect, IonItem, IonLabel, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonAvatar, IonTitle, IonNav, IonBackButton } from '@ionic/react';
import React from 'react';

import './Main.css';

import firebase from 'firebase';

import { History } from 'history';

import PersonData from '../data/Person';

class Person extends React.Component<{ history: History }, { isEditButtonVisible: boolean }> {
  private person: PersonData;

  constructor(props: { history: History }) {
    super(props);

    var user: firebase.User | null = firebase.auth().currentUser;

    var showEditIfAdmin = (user:any) => {
      firebase.firestore().doc("/users/" + user.uid).get().then(value => {
        var data: any = value.data();
        if (data.role == "admin") {
          this.setState({ isEditButtonVisible: true });
        }else{
          this.setState({ isEditButtonVisible: false });
        }
      }).catch(e => {
        console.log(e);
        this.setState({ isEditButtonVisible: false });
      })
    }

    if (history.state.state) {
      this.person = history.state.state.person;
      if (user && user.uid == this.person.id)
        this.state = { isEditButtonVisible: true };
      else {
        this.state={isEditButtonVisible: true};
        firebase.auth().onAuthStateChanged(user => {
          if(user && user.uid == this.person.id)
            this.setState({ isEditButtonVisible: true });
          else
            showEditIfAdmin(user);
        });
      }
    } else
      this.person = new PersonData("", "", "", "", "", "", "", [], "");
  }
  render() {
    const p = this.person;
    const { history } = this.props;
    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonIcon onClick={e => history.goBack()} class="iconButton2" name="arrow-back" style={{ width: "50px", fontSize: "40px", margin: "11px 8px 0px 8px", float: "left" }} />
            {this.state.isEditButtonVisible && (
            <IonIcon onClick={e => history.push('/main/person/editor', { person: this.person })} class="iconButton" style={{ float: "right", fontSize: "50px", margin: "5px 5px 0px 0px" }} name="create" />
            )}
            <h1>ProfBook</h1>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div id="profilContainer">
            <IonImg src={p.avatar || "data:image/png;base64,    "} class="avatar" />
            <div style={{ textAlign: "center" }}>
              <h1 style={{ display: "inline" }}>{p.prenom + " " + p.nom}</h1>
              <h3 style={{ display: "inline", fontStyle: "italic" }}> ({p.initiales})</h3>
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