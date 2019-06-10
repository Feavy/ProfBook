import { IonContent, IonHeader, IonToolbar, IonImg, IonIcon, IonSelect, IonItem, IonLabel, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonAvatar, IonTitle, IonNav, IonBackButton, IonInput, IonTextarea, IonAlert, IonButton } from '@ionic/react';
import React, { ChangeEvent } from 'react';

import './Main.css';

import PersonData from '../data/Person';
import { SelectChangeEventDetail } from '@ionic/core';

import firebase from "firebase";

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
}

class Person extends React.Component<{ history: History }, State> {
  private isCreation: boolean;

  private modules: string[];

  private currentId: string;

  constructor(props: { history: History }) {
    super(props);

    this.setPrenomNom = this.setPrenomNom.bind(this);
    this.setInitiales = this.setInitiales.bind(this);
    this.setFonction = this.setFonction.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setModules = this.setModules.bind(this);
    this.setFormation = this.setFormation.bind(this);
    this.selectImage = this.selectImage.bind(this);

    this.save = this.save.bind(this);

    this.currentId = "";

    if (history.state.state && history.state.state.person) {
      this.isCreation = false;
      var p: PersonData = history.state.state.person;
      this.currentId = p.id;
      this.state = {
        prenomNom: p.prenom + " " + p.nom,
        avatar: p.avatar,
        initiales: p.initiales,
        fonction: p.fonction,
        formation: p.formation,
        modules: p.modules,
        description: p.description,
        errorMsg: "",
        successMsg: ""
      }
      this.modules = p.modules;
    } else {
      this.isCreation = true;
      this.state = {
        prenomNom: "",
        avatar: "data:image/png;base64,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",
        initiales: "",
        fonction: "Enseignant",
        formation: "DUT",
        modules: [],
        description: "",
        errorMsg: "",
        successMsg: ""
      }
      this.modules = [];
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
        firebase.firestore().collection("fiches").add(
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
            self.props.history.replace("/main");
          })
          .catch(function (error: any) {
            self.setState({ errorMsg: "Échec lors de l'ajout dans la base de données : <br>" + error });
          });
      } else {
        firebase.firestore().collection("fiches").doc(this.currentId).update(
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
            self.props.history.replace("/main");
          })
          .catch(function (error: any) {
            self.setState({ errorMsg: "Échec lors de la mise à jour dans la base de données : <br>" + error });
          });
      }


    } else {
      this.setState({ errorMsg: errorMsg });
    }
  }

  selectImage(e: ChangeEvent) {
    var elem: HTMLInputElement = e.target as HTMLInputElement;
    console.log(elem.files);
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
    const { prenomNom, initiales, fonction, formation, modules, description, avatar, errorMsg, successMsg } = this.state;
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
            <IonBackButton style={{ float: "left", width: "50px", margin: "8px .5em 0 .5em" }} goBack={() => console.log("back")} />
            <IonIcon class="iconButton" style={{ float: "right", fontSize: "50px", margin: "5px 5px 0px 0px" }} name="save" onClick={this.save} />
            <h1>{this.isCreation ? "Nouvelle fiche" : "Édition : " + prenomNom}</h1>
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
              <IonSelect multiple={true} value={modules} onIonChange={this.setModules}>
                <IonSelectOption value="IAP">IAP</IonSelectOption>
                <IonSelectOption value="POO">POO</IonSelectOption>
                <IonSelectOption value="AMN">AMN</IonSelectOption>
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