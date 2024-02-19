import { Injectable, Input, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  // -------------------------- Möglichkeit 1 --------------------------
  // items$:any; // Ein Platzhalter für das Observable, das die Notizen aus Firestore abruft 
  // items:any; // Ein Platzhalter für das Ergebnis der Abfrage 


  
  // -------------------------- Möglichkeit 2 --------------------------

  unsubTrash;
  unsubNotes;


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


  }


  ngOnDestroy(){
    // // -------------------------- Möglichkeit 1 --------------------------
    // this.items.unsubscribe();// Das Abonnement wird sofort wieder beendet, um Ressourcen freizugeben und unerwünschte Nebeneffekte zu verhindern

    // -------------------------- Möglichkeit 2 --------------------------
    this.unsubTrash();// Das Abonnement auf Aktualisierungen in der "notes"-Sammlung wird sofort wieder beendet
    // Das Abonnement auf das einzelne Dokument wird sofort wieder beendet
    this.unsubNotes();
  }


  setNotesObjact(obj: any, id: string): Note{
  //   console.log({
  //     id: id,
  //     type: obj.type || "",
  //     title: obj.title || "",
  //     content: obj.content || "",
  //     marked: obj.marked || false
  // });
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
        console.log(this.setNotesObjact(element.data(), element.id), "subTrashList");
      });
    });
  }


  subNotesList(){
    return onSnapshot(this.getNotesRef(), (list:any) => {
      this.normalNotes = [];
      list.forEach((element:any) => {
        this.normalNotes.push(this.setNotesObjact(element.data(), element.id));
        console.log(this.setNotesObjact(element.data(), element.id), "subNotesList");
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
