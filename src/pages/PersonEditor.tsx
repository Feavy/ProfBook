import { IonContent, IonHeader, IonToolbar, IonImg, IonIcon, IonSelect, IonItem, IonLabel, IonSelectOption, IonBackButton, IonInput, IonTextarea, IonAlert } from '@ionic/react';
import React, { ChangeEvent } from 'react';

import './Main.css';

import PersonData from '../data/Person';
import { SelectChangeEventDetail } from '@ionic/core';

import firebase from "firebase";

import modulesList from "../data/Modules";

import { History } from 'history';

interface State {
  prenomNom: string;
  avatar: string;
  initiales: string;
  fonction: string;
  formation: string;
  modules: any;
  description: string;

  errorMsg: string;
  successMsg: string;

  isIdSelectVisible: boolean;
  selectedId: string;
}

class Person extends React.Component<{ history: History }, State> {
  private isCreation: boolean;

  private modules: string[];

  private prenomNom:string;

  private users:{id:string, name:string}[];

  constructor(props: { history: History }) {
    super(props);

    this.setPrenomNom = this.setPrenomNom.bind(this);
    this.setInitiales = this.setInitiales.bind(this);
    this.setFonction = this.setFonction.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setModules = this.setModules.bind(this);
    this.setFormation = this.setFormation.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.setId = this.setId.bind(this);

    this.save = this.save.bind(this);

    this.users = [];

    this.prenomNom = "";
    this.isCreation = true;
    this.modules = [];

    var user: firebase.User | null = firebase.auth().currentUser;

    var showIdSelectIfAdmin = (user:any) => {
      firebase.firestore().doc("/users/" + user.uid).get().then(value => {
        var data: any = value.data();
        if (data.role == "admin") {
          firebase.firestore().collection("users").where("role", "==", "enseignant").get().then(values => {
            values.forEach(value => {
              this.users.push({id: value.id, name:value.data().name});
            });
            this.setState({ isIdSelectVisible: true });
          }).catch(e => console.log(e));
        }else{
          this.setState({ isIdSelectVisible: false });
        }
      }).catch(e => console.log(e));
    }

    if (user)
      showIdSelectIfAdmin(user);
    else
      firebase.auth().onAuthStateChanged(user => {
        showIdSelectIfAdmin(user);
      });

    var id:string = "";

    if(history.state.state && history.state.state.id)
      id = history.state.state.id;

    if (history.state.state && history.state.state.person) {
      var p: PersonData = history.state.state.person;
      this.isCreation = p.prenom.length == 0;
      id = p.id;
      this.prenomNom = p.prenom + " " + p.nom;
      this.state = {
        prenomNom: p.prenom + " " + p.nom,
        avatar: p.avatar,
        initiales: p.initiales,
        fonction: p.fonction,
        formation: p.formation,
        modules: p.modules,
        description: p.description,
        errorMsg: "",
        successMsg: "",
        isIdSelectVisible: false,
        selectedId: id
      }
      this.modules = p.modules;
    }
  }

  componentWillReceiveProps(props:{history:History}, state:State) {
    var id:string = "";

    this.prenomNom = "";
    this.isCreation = true;
    this.modules = [];

    if(history.state.state && history.state.state.id)
      id = history.state.state.id;

    if (history.state.state && history.state.state.person) {
      var p: PersonData = history.state.state.person;
      this.isCreation = p.prenom.length == 0;
      id = p.id;
      this.prenomNom = p.prenom + " " + p.nom;
      this.setState ({
        prenomNom: p.prenom + " " + p.nom,
        avatar: p.avatar,
        initiales: p.initiales,
        fonction: p.fonction,
        formation: p.formation,
        modules: p.modules,
        description: p.description,
        errorMsg: "",
        successMsg: "",
        selectedId: id
      });
      this.modules = p.modules;
    }
  }

  setPrenomNom(e: CustomEvent<KeyboardEvent>) {
    var input: HTMLIonInputElement = e.target as HTMLIonInputElement;
    if (input.value)
      this.setState({ prenomNom: input.value });
  }

  setInitiales(e: CustomEvent<KeyboardEvent>) {
    var input: HTMLIonInputElement = e.target as HTMLIonInputElement;
    if (input.value)
      this.setState({ initiales: input.value });
  }

  setFonction(e: CustomEvent<SelectChangeEventDetail>) {
    var input: HTMLIonSelectElement = e.target as HTMLIonSelectElement;
    if (input.value) {
      this.setState({ fonction: input.value });
    }
  }

  setFormation(e: CustomEvent<SelectChangeEventDetail>) {
    var input: HTMLIonSelectElement = e.target as HTMLIonSelectElement;
    if (input.value) {
      this.setState({ formation: input.value });
    }
  }

  setModules(e: CustomEvent<SelectChangeEventDetail>) {
    var input: HTMLIonSelectElement = e.target as HTMLIonSelectElement;
    this.modules = input.value;
  }

  setDescription(e: CustomEvent<KeyboardEvent>) {
    var input: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
    if (input.value)
      this.setState({ description: input.value });
  }

  save() {
    const { prenomNom, initiales, fonction, formation, description, avatar} = this.state;

    var errorMsg: string = "";

    if (!prenomNom.match("[a-zA-Zéàè-]+ [a-zA-Zéàè-]+")) {
      errorMsg += "L'entrée 'Prénom Nom' est invalide.<br>";
    }
    if (initiales.length == 0 || initiales.length > 3) {
      errorMsg += "Les initiales entrées sont invalides.<br>";
    }
    if (this.modules.length == 0) {
      errorMsg += "Au moins un module doit être sélectionné.<br>";
    }
    if (description.length == 0) {
      errorMsg += "La descrition doit être remplie.<br>";
    }

    var self = this;

    if (errorMsg.length == 0) {
      var re: RegExp = new RegExp("([a-zA-Zéàè-]+) ([a-zA-Zéàè-]+)");
      var rep: RegExpExecArray | null;
      var prenom: string = "undefined", nom: string = "undefined";
      if ((rep = re.exec(prenomNom)) !== null) {
        prenom = rep[1];
        nom = rep[2];
      }
      if (this.isCreation) {
        firebase.firestore().collection("fiches").doc(this.state.selectedId).set(
          {
            prenom: prenom,
            avatar: avatar,
            nom: nom,
            initiales: initiales,
            fonction: fonction,
            formation: formation,
            modules: this.modules,
            description: description
          }).then(function (docRef: any) {
            self.setState({ successMsg: "La fiche a bien été créée." });
            self.props.history.goBack();
          })
          .catch(function (error: any) {
            self.setState({ errorMsg: "Échec lors de l'ajout dans la base de données : <br>" + error });
          });
        } else {
          firebase.firestore().collection("fiches").doc(this.state.selectedId).update(
            {
              prenom: prenom,
              avatar: avatar,
              nom: nom,
              initiales: initiales,
              fonction: fonction,
              formation: formation,
              modules: this.modules,
              description: description
            }).then(function (docRef: any) {
              self.setState({ successMsg: "La fiche a bien été mise à jour." });
              self.props.history.go(-2);
          })
          .catch(function (error: any) {
            self.setState({ errorMsg: "Échec lors de la mise à jour dans la base de données : <br>" + error });
          });
      }


    } else {
      this.setState({ errorMsg: errorMsg });
    }
  }

  setId(e:any) {
    this.setState({selectedId: e.target.value});
  }

  selectImage(e: ChangeEvent) {
    var elem: HTMLInputElement = e.target as HTMLInputElement;
    var reader = new FileReader();

    var self = this;

    if (elem.files) {
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function (e: any) {
          // Render thumbnail.
          self.setState({avatar: e.target.result});
        };
      })(elem.files[0]);

      // Read in the image file as a data URL.
      reader.readAsDataURL(elem.files[0]);
    }
  }

  render() {
    const { prenomNom, initiales, fonction, formation, modules, description, avatar, errorMsg, successMsg, isIdSelectVisible, selectedId } = this.state;
    return (
      <>
        <IonAlert
          isOpen={errorMsg.length > 0}
          onDidDismiss={() => this.setState(() => ({ errorMsg: "" }))}
          header={'Erreur'}
          message={errorMsg}
          buttons={['OK']}
          color={"danger"}
        />
        <IonAlert
          isOpen={successMsg.length > 0}
          onDidDismiss={() => this.setState(() => ({ successMsg: "" }))}
          header={'Succès'}
          message={successMsg}
          buttons={['OK']}
          color={"danger"}
        />
        <IonHeader>
          <IonToolbar>
            <IonIcon onClick={e => this.props.history.goBack()} class="iconButton2" name="arrow-back" style={{ width: "50px", fontSize: "40px", margin: "11px 8px 0px 8px", float: "left" }} />
            <IonIcon class="iconButton" style={{ float: "right", fontSize: "50px", margin: "5px 5px 0px 0px" }} name="save" onClick={this.save} />
            <h1>{this.isCreation ? "Nouvelle fiche" : "Édition : " + this.prenomNom}</h1>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div id="profilContainer">
            <IonImg src={avatar} class="avatar" />
            <div id="imgUploadContainer">
              <span>...</span>
              <input type="file" id="imgUploadButton" onChange={this.selectImage} />
            </div>
            <div style={{ textAlign: "center" }}>
              <IonItem style={{
                maxWidth: '250px',
                display: 'inline-block',
                marginRight: '1em'
              }}>
                <IonInput style={{ textAlign: 'center' }} type="text" placeholder="Prénom Nom" value={prenomNom} onIonInput={this.setPrenomNom}></IonInput>
              </IonItem>
              <IonItem style={{
                maxWidth: '60px',
                display: 'inline-block'
              }}>
                <IonInput type="text" placeholder="Init" value={initiales} onIonInput={this.setInitiales}></IonInput>
              </IonItem>
              <IonItem style={{
                maxWidth: '300px',
                display: 'block',
                margin: 'auto'
              }} >

                <IonLabel position="stacked">Fonction</IonLabel>
                <IonSelect multiple={false} interface="popover" value={fonction} onIonChange={this.setFonction}>
                  <IonSelectOption value="Enseignant">Enseignant</IonSelectOption>
                  <IonSelectOption value="Enseignant-Chercheur">Enseignant-Chercheur</IonSelectOption>
                  <IonSelectOption value="Vacataire">Vacataire</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>
            { isIdSelectVisible && (
              <>
                <h3>Compte lié :</h3>
                <IonItem>
                  <IonLabel></IonLabel>
                  <IonSelect value={selectedId} onIonChange={this.setId}>
                    {this.users.map(user => (
                      <IonSelectOption value={user.id} key={user.id}>{user.name}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </>
              )
            }
            <h3>Formation :</h3>
            <IonItem>
              <IonLabel></IonLabel>
              <IonSelect multiple={false} value={formation} onIonChange={this.setFormation}>
                <IonSelectOption value="DUT">DUT</IonSelectOption>
                <IonSelectOption value="LP">LP</IonSelectOption>
              </IonSelect>
            </IonItem>
            <h3>Modules :</h3>
            <IonItem>
              <IonLabel></IonLabel>
              <IonSelect multiple={true} onIonChange={this.setModules}>
                {modulesList.map(module => (
                  <IonSelectOption value={module} key={module}>{module}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <h3>Descriptif :</h3>
            <IonItem>
              <IonTextarea rows={10} style={{
                border: "1px solid #EEE",
                borderRadius: "5px"
              }} value={description} onIonInput={this.setDescription}>
              </IonTextarea>
            </IonItem>
          </div>
        </IonContent>

      </>
    );
  }
}

export default Person;