<script setup>
import { db } from "../db_config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

import { ref } from "vue";

const email = ref("");
const password = ref("Cambiami");
const scuolaId = ref("");

const signupHandler = () => {
  signUpAndLogin(email.value, password.value);
};

function signUpAndLogin(email, password) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user);
      await setDoc(doc(db, "users", user.uid), {
        scuolaId: scuolaId.value,
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({ text: errorMessage, code: errorCode });
    });
}

const scuole = ref([]);

async function readScuoleData() {
  const docsSnap = await getDocs(collection(db, "scuole"));
  const datas = [];
  docsSnap.forEach((doc) => {
    console.log(doc);
    datas.push({ id: doc.id, data: doc.data() });
  });
  scuole.value = datas;
}

readScuoleData();
</script>

<template>
  <div class="signup">
    <h3 class="heading-tertiary u-center-text u-margin-bottom-small">
      Registra un nuovo account
    </h3>
    <p class="paragraph">
      Mantieni la console aperta per verificare lo stato dell'operazione
    </p>
    <form class="form" @submit.prevent="signupHandler">
      <div class="form__group">
        <input
          type="email"
          id="email"
          name="email"
          class="form__input"
          v-model="email"
          placeholder="email"
        />
        <label for="email" class="form__label">Email</label>
      </div>
      <div class="form__group">
        <input
          type="text"
          id="password"
          name="password"
          class="form__input"
          v-model="password"
        />
        <label for="password" class="form__label">Password</label>
      </div>
      <div class="form__group">
        <select
          name="scuola"
          id="scuola"
          class="form__input"
          v-model="scuolaId"
        >
          <option v-for="scuola in scuole" :value="scuola.id">
            {{ scuola.data.nome }}, {{ scuola.data.loc }}
          </option>
        </select>
        <label for="scuola" class="form__label">Scuola di appartenenza</label>
      </div>
      <div class="form__group u-center-text">
        <button type="submit" class="btn btn--primary">Registra utente</button>
      </div>
    </form>
  </div>
</template>
