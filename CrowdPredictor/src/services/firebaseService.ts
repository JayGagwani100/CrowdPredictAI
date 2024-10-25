import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo',
  authDomain: 'crowdpredictor-439701.firebaseapp.com',
  databaseURL: 'https://crowdpredictor-439701.firebaseio.com',
  projectId: 'crowdpredictor-439701',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const saveDataToFirebase = (placeId: string, data: any) => {
  const crowdRef = ref(database, `crowds/${placeId}`);
  push(crowdRef, data);
};