import { IonContent, IonHeader, IonToolbar, IonImg, IonIcon, IonSelect, IonItem, IonLabel, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonAvatar, IonPopover, IonFab, IonFabButton, IonRefresher, IonRefresherContent } from '@ionic/react';
import React from 'react';

import Person from '../data/Person';

import firebase from "firebase";

import {History} from 'history';

import './Main.css';

class Main extends React.Component<{history:History}, {isMenuVisible:boolean, popoverEvent:Event|null, people:Person[]}> {
  constructor(props: {history:History}) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.state = {isMenuVisible: false, popoverEvent: null, people: []};
    this.refresh(null);
  }

  refresh(e:any) {
    var people:Person[] = [];
    firebase.firestore().collection("fiches").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.data());
          var data:any = doc.data();
          people.push(new Person(doc.id, data.avatar, data.prenom, data.nom, data.initiales, data.fonction, data.formation, data.modules, data.description));
      });
      this.setState({people: people});
      if(e) {
        e.target.complete();
      }
   });
   console.log("refreshed");
  }

  render() {
    const {history} = this.props;
    console.log(this.state.people);
    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonImg src="/assets/icon/icon.png" style={{ width: "50px", float: "left", marginRight: "1em" }} />
            <IonIcon class="iconButton" name="person" style={{ float: "right", fontSize: "50px", margin: "5px 5px 0px 0px" }}
              onClick={(e:any) => {
                e.persist();
                this.setState({isMenuVisible: true, popoverEvent: e});
              }}
            />
            <IonPopover
              showBackdrop={true}
              isOpen={this.state.isMenuVisible}
              event={this.state.popoverEvent}
              onDidDismiss={() => this.setState(() => ({ isMenuVisible: false }))}
            >
              <h2>Menu</h2>
              <IonList>
                <IonItem class="menuButton">
                  Profil
                </IonItem>
                <IonItem class="menuButton" onClick={e => {
                  firebase.auth().signOut().then(e => {
                    history.push('/home');
                    this.setState({isMenuVisible: false})
                  });
                }}>
                  <span style={{color: "red"}}>Déconnexion</span>
                </IonItem>
              </IonList>
            </IonPopover>
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
          <IonRefresher slot="fixed" onIonRefresh={this.refresh}>
            <IonRefresherContent>

            </IonRefresherContent>
          </IonRefresher>
          <IonList id="peopleList">
            {this.state.people.map((p, x) =>
              <IonItem class="profilItem" key={x+1} onClick={() => {
                history.push("/main/person", { person: p })
              }}>
                <IonAvatar slot="start" style={{ float: "left", marginRight: "1em" }}>
                  <img src={p.avatar} />
                </IonAvatar>
                <IonLabel>
                  <h2 style={{ display: "inline", fontWeight: "bold" }}>{p.prenom + " "+p.nom}</h2><h3 style={{ display: "inline" }}> ({p.initiales})</h3>
                  <h2 style={{ float: "right" }}>{p.formation}</h2><br />
                  <p style={{ fontStyle: "italic", display: "inline" }}>{p.modules.join(", ")}</p>
                  <p style={{ width: "125px", textAlign: "right", display: "inline", fontSize: "10px", position: "absolute", right: "15px" }}>{p.fonction}</p>
                  <p>{p.description}</p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => this.props.history.push('/main/person/editor')} color="danger">
            <IonIcon name="add" />
          </IonFabButton>
        </IonFab>
        </IonContent>

      </>
    );
  }
}

export default Main;