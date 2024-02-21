import { Component, Output, EventEmitter } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service'



@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.scss']
})


export class AddNoteDialogComponent {
  @Output() addDialogClosed: EventEmitter<boolean> = new EventEmitter();

  title = "";
  description = "";

  constructor(private noteService: NoteListService){}


  closeDialog() {
    this.title = "";
    this.description = "";
    this.addDialogClosed.emit(false); // löst ein Ereignis aus, das an die Elternkomponente signalisiert, dass das Dialogfeld nicht erfolgreich geschlossen wurde, indem es den Wert false übermittelt.
  }


  addNote(){
    let note: Note = {
      type: "note",
      title: this.title,
      content: this.description,
      marked: false
    }
    
    this.noteService.addNote(note, 'notes');
    //beachte das closeDialog() zum Schluss kommt, denn es leert die Variablen
    this.closeDialog();
  }
}
