import { IonContent, IonHeader, IonToolbar, IonImg, IonIcon, IonSelect, IonItem, IonLabel, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonAvatar, IonPopover, IonFab, IonFabButton, IonRefresher, IonRefresherContent } from '@ionic/react';
import React from 'react';

import Person from '../data/Person';

import firebase from "firebase";

import { History } from 'history';

import modules from '../data/Modules';

import './Main.css';

class Main extends React.Component<{ history: History }, { isMenuVisible: boolean, popoverEvent: Event | null, visiblePeople: Person[], isCreateButtonVisible: boolean, isProfileButtonVisible:boolean, module:string, formation:string }> {

  private people:Person[];

  constructor(props: { history: History }) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.setModule = this.setModule.bind(this);
    this.setFormation = this.setFormation.bind(this);
    this.refreshView = this.refreshView.bind(this);
    this.state = { isMenuVisible: false, isProfileButtonVisible:false, popoverEvent: null, visiblePeople: [], isCreateButtonVisible: false, module: "all", formation: "all" };
    this.refresh(null);

    this.people = [];

    var user: firebase.User | null = firebase.auth().currentUser;

    var showButtonIfAdmin = (user:any) => {
      firebase.firestore().doc("/users/" + user.uid).get().then(value => {
        var data: any = value.data();
        if (data.role == "admin")
          this.setState({ isCreateButtonVisible: true });
        else
          this.setState({ isCreateButtonVisible: false });
        if(data.role != "etudiant")
          this.setState({ isProfileButtonVisible: true });
        else
          this.setState({ isProfileButtonVisible: false });
      }).catch(e => console.log(e));
    }

    if (user) {
      showButtonIfAdmin(user);
    } else
      firebase.auth().onAuthStateChanged(user => {
        showButtonIfAdmin(user);
      });
  }

  refresh(e: any) {
    var people: Person[] = [];
    firebase.firestore().collection("fiches").orderBy("prenom").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data: any = doc.data();
        people.push(new Person(doc.id, data.avatar, data.prenom, data.nom, data.initiales, data.fonction, data.formation, data.modules, data.description));
      });
      this.people = people;
      this.refreshView();
      if (e) {
        e.target.complete();
      }
    });
  }

  refreshView() {
    var visiblePeople = [];
      var p:Person;
      for(var p of this.people) {
        if((this.state.module == "all" || p.modules.some(e => e == this.state.module)) && (this.state.formation == "all" || p.formation == this.state.formation))
          visiblePeople.push(p);
      }
      this.setState({ visiblePeople: visiblePeople });
  }

  editProfile() {
    var user: firebase.User | null = firebase.auth().currentUser;
    if (user) {
      firebase.firestore().doc("/fiches/" + user.uid).get().then(doc => {
        var data: any = doc.data();
        this.props.history.push('/main/person/editor',
          { person: new Person(doc.id, data.avatar, data.prenom, data.nom, data.initiales, data.fonction, data.formation, data.modules, data.description) });
      }).catch(e => {
        if (user)
          this.props.history.push('/main/person/editor', { person: new Person(user.uid) });
      });
    }
    this.setState({ isMenuVisible: false });
  }

  setModule(e:any) {
    this.setState({module: e.target.value});
    this.refreshView();
  }

  setFormation(e:any) {
    this.setState({formation: e.target.value});
    this.refreshView();
  }

  render() {
    const { history } = this.props;
    var w: any = window;
    w.histo = history;
    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonImg src="/assets/icon/icon.png" style={{ width: "50px", float: "left", marginRight: "1em" }} />
            <IonIcon class="iconButton" name="person" style={{ float: "right", fontSize: "50px", margin: "5px 5px 0px 0px" }}
              onClick={(e: any) => {
                e.persist();
                this.setState({ isMenuVisible: true, popoverEvent: e });
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
                {this.state.isProfileButtonVisible && (
                <IonItem class="menuButton" onClick={this.editProfile}>
                  Profil
                </IonItem>
                )}
                <IonItem class="menuButton" onClick={e => {
                  firebase.auth().signOut().then(e => {
                    history.push('/home');
                    this.setState({ isMenuVisible: false });
                  });
                }}>
                  <span style={{ color: "red" }}>Déconnexion</span>
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
                    <IonSelect multiple={false} interface="popover" value={this.state.module} onIonChange={this.setModule}>
                      <IonSelectOption value="all">Tous</IonSelectOption>
                      {modules.map(module => (
                        <IonSelectOption value={module} key={module}>{module}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">Formation</IonLabel>
                    <IonSelect interface="popover" value={this.state.formation} onIonChange={this.setFormation}>
                      <IonSelectOption value="all">Toutes</IonSelectOption>
                      <IonSelectOption value="DUT">DUT</IonSelectOption>
                      <IonSelectOption value="LP">LP</IonSelectOption>
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
            {this.state.visiblePeople.map((p, x) =>
              <IonItem class="profilItem" key={x + 1} onClick={() => {
                history.push("/main/person", { person: p })
              }}>
                <IonAvatar slot="start" style={{ float: "left", marginRight: "1em" }}>
                  <img src={p.avatar} />
                </IonAvatar>
                <IonLabel>
                  <h2 style={{ display: "inline", fontWeight: "bold" }}>{p.prenom + " " + p.nom}</h2><h3 style={{ display: "inline" }}> ({p.initiales})</h3>
                  <h2 style={{ float: "right" }}>{p.formation}</h2><br />
                  <p style={{ fontStyle: "italic", display: "inline" }}>{p.modules.join(", ")}</p>
                  <p style={{ width: "125px", textAlign: "right", display: "inline", fontSize: "10px", position: "absolute", right: "15px" }}>{p.fonction}</p>
                  <p>{p.description}</p>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            {this.state.isCreateButtonVisible &&
              <IonFabButton onClick={() => this.props.history.push('/main/person/editor', { person: new Person() })} color="danger">
                <IonIcon name="add" />
          </IonFabButton>
            }
          </IonFab>
        </IonContent>

      </>
    );
  }
}

export default Main;