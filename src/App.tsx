import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { IonPage, IonRouterOutlet } from '@ionic/react';

import Home from './pages/Home';
import Connexion from './pages/Connexion';
import Main from './pages/Main';
import Person from './pages/Person';
import PersonEditor from './pages/PersonEditor';

/* Core CSS required for Ionic components to work properly */
import "@ionic/core/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/core/css/normalize.css";
import "@ionic/core/css/structure.css";
import "@ionic/core/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/core/css/padding.css";
import "@ionic/core/css/float-elements.css";
import "@ionic/core/css/text-alignment.css";
import "@ionic/core/css/text-transformation.css";
import "@ionic/core/css/flex-utils.css";
import "@ionic/core/css/display.css";

import {History} from 'history';

import firebase from "firebase";

import './theme.css';

class App extends React.Component<{}, {path:string}> {
  constructor(props:{}) {
    super(props);
    var firebaseConfig = {
      apiKey: "AIzaSyBV7pk1IUcgQw7Iv3yVzv85utnKI-jodTM",
      authDomain: "profbook-a059b.firebaseapp.com",
      databaseURL: "https://profbook-a059b.firebaseio.com",
      projectId: "profbook-a059b",
      storageBucket: "profbook-a059b.appspot.com",
      messagingSenderId: "1037203186876",
      appId: "1:1037203186876:web:2ad03a07ce307ccc"
    };
    // Initialize Firebase

    this.state = {path: '/home'};

    firebase.initializeApp(firebaseConfig);

    console.log(firebase.auth());

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({path: '/main'});
      }
    });
  }
  render() {
    return (
      <Router>
      <Route exact path="/"/>
      <Redirect to='/home'/>
      <div className="App">
        <IonPage>
          <IonRouterOutlet>
            <Route path="/:tab(home)" component={Home} exact={true} />
            <Route path="/:tab(connexion)" component={Connexion} exact={true} />
            <Route path="/:tab(main)" component={Main} exact={true} />
            <Route path="/:tab(main)/person" component={Person} exact={true} />
            <Route path="/:tab(main)/person/editor" component={PersonEditor} exact={true} />
          </IonRouterOutlet>
        </IonPage>
      </div>
    </Router>
    );
  }
}

export default App;
