import { Injectable, Input, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, orderBy, limit, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  // -------------------------- Möglichkeit 1 --------------------------
  // items$:any; // Ein Platzhalter für das Observable, das die Notizen aus Firestore abruft 
  // items:any; // Ein Platzhalter für das Ergebnis der Abfrage 


  
  // -------------------------- Möglichkeit 2 --------------------------

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  firestore: Firestore = inject(Firestore); // Das Firestore-Objekt für die Datenbankverbindung

  constructor() {
    // // -------------------------- Möglichkeit 1 --------------------------
    // // Beim Konstruieren des Dienstes wird das items$-Observable initialisiert, um Daten aus Firestore abzurufen
    // this.items$ = collectionData(this.getNotesRef()); // Die collectionData-Funktion wird verwendet, um eine Sammlung von Dokumenten aus Firestore abzurufen
    // // Hier wird ein Abonnement auf das Observable erstellt, um auf neue Daten zu reagieren
    // this.items = this.items$.subscribe((list:any) => {
    //   // Wenn neue Daten verfügbar sind, wird diese Funktion ausgeführt
    //   list.forEach((element:any) => {
    //     console.log(element);
    //   });
    // });
  

    
    // // -------------------------- Möglichkeit 2 --------------------------
    this.unsubNotes = this.subNotesList();

    // this.unsubTrash = onSnapshot(this.getSingleDocRef("notes", "34gwervev345r43e"), (elemnt) => {});
    this.unsubTrash = this.subTrashList();
    this.unsubMarkedNotes = this.subMarkedNotesList();


  }


  async deleteNote(callId: "notes" | "trash", docId:string){
    await deleteDoc(this.getSingleDocRef(callId, docId)).catch(  // deleteDoc muss wissen, was gelöscht werden soll
      (err) => {console.log(err);
      }
    );
  }


  ngOnDestroy(){
    // // -------------------------- Möglichkeit 1 --------------------------
    // this.items.unsubscribe();// Das Abonnement wird sofort wieder beendet, um Ressourcen freizugeben und unerwünschte Nebeneffekte zu verhindern

    // -------------------------- Möglichkeit 2 --------------------------
    this.unsubTrash();// Das Abonnement auf Aktualisierungen in der "notes"-Sammlung wird sofort wieder beendet
    // Das Abonnement auf das einzelne Dokument wird sofort wieder beendet
    this.unsubNotes();
    this.unsubMarkedNotes();
  }

  /**
   * Um einige Felder eines Dokuments zu aktualisieren, ohne das gesamte Dokument zu überschreiben, verwenden Sie die folgenden sprachspezifischen update() Methoden
   */
  async updateNote(note: Note){
    if(note.id){ 
      //this.getSingleDocRef(callId, docId): erforderliche referenz 
      let docRef = this.getSingleDocRef(this.getCallIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch( // wo genau(docRef) und was soll da rein(this.getCleanJson(note))
        (err) => {console.log(err);}
        );
    }
  }


  getCleanJson(note: Note):{}{
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked:  note.marked,
    }
  }


  getCallIdFromNote(note: Note): string{
    if (note.type =='note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, callId: "notes" | "trash"){
    let getCurrentValue;
    if (callId === 'notes') {
      getCurrentValue = this.getNotesRef();
    } else if(callId === "trash"){
      getCurrentValue = this.getTrashRef();
    } else {
      throw new Error("Ungültiger callId-Parameter");
    } 

    await addDoc(getCurrentValue, item).catch(
      (err) => { console.error(err)}
    ).then(
      (docRef) => {console.log("Document written with ID", docRef?.id);}
    )
  }
  // async addNote(item: Note, callId: "notes" | "trash"){
  //   if (callId == 'notes') {
  //     await addDoc(this.getNotesRef(), item).catch(
  //       (err) => { console.error(err)}
  //     ).then(
  //       (docRef) => {console.log("Document written with ID", docRef?.id);}
  //     )
  //   } else {
  //     await addDoc(this.getTrashRef(), item).catch(
  //       (err) => { console.error(err)}
  //     ).then(
  //       (docRef) => {console.log("Document written with ID", docRef?.id);}
  //     )
  //   }
  // }



  setNotesObjact(obj: any, id: string): Note{
    return  {
        id: id,
        type: obj.type || "",
        title: obj.title || "",
        content: obj.content || "",
        marked: obj.marked || false
    }
  }


  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list:any) => {
      this.trashNotes = [];
      list.forEach((element:any) => {
        this.trashNotes.push(this.setNotesObjact(element.data(), element.id));
      });
    });
  }


  subNotesList(){
    // let ref = collection(doc(collection(this.firestore, "notes"), "6OHiT030QYh3fiNt5Dok"), "notesExtra"); // weg 1 um auf die subCollection(in Firebase) zu kommen
    // let ref = collection(this.firestore, "notes/6OHiT030QYh3fiNt5Dok/notesExtra");// weg 2 um auf die subCollection(in Firebase) zu kommen

    // filter: woher - (this.getNotesRef()), wonach - (where("state", "==", "CA")) | (orderBy("state")), max. Anzahl der Ergebinsse = limit(100) - bei 200 Ergebinssen bekommt man die ersten 100
    // const q = query(ref, limit(100));
    const q = query(this.getNotesRef(), limit(100));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element:any) => {
        this.normalNotes.push(this.setNotesObjact(element.data(), element.id));
      });
      list.docChanges().forEach((change) => { // zeigt status der tasks an, wenn sich was verändert | einsetzen wenn mans will/braucht
        if (change.type === "added") {
            console.log("New note: ", change.doc.data());
        }
        if (change.type === "modified") {
            console.log("Modified note: ", change.doc.data());
        }
        if (change.type === "removed") {
            console.log("Removed note: ", change.doc.data());
        }
      });
    });
  }


  subMarkedNotesList(){ //feiltere nach denen, die marked-wert true haben
  // filter: woher - (this.getNotesRef()), wonach - (where("state", "==", "CA")) | (orderBy("state")), max. Anzahl der Ergebinsse = limit(100) - bei 200 Ergebinssen bekommt man die ersten 100
    const q = query(this.getNotesRef(), where("marked", "==", true), limit(100));
    return onSnapshot(q, (list:any) => {
      this.normalMarkedNotes = [];
      list.forEach((element:any) => {
        this.normalMarkedNotes.push(this.setNotesObjact(element.data(), element.id));
      });
    });
  }

  // const itemCollection = collection(this.firestore, 'items');

  getTrashRef(){
    return collection(this.firestore, 'trash'); // 'trash' = Referenz/id
  } 

  getNotesRef(){
    return collection(this.firestore, 'notes'); // 'notes' = Referenz/id
  } 

  getSingleDocRef(callId:string, docId:string){
    return doc(collection(this.firestore, callId), docId); // Verwende collectionData, um die Daten aus Firestore abzurufen und zu konvertieren
  }
}
