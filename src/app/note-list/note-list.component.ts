import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service'


@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent {
  noteList: Note[] = [];
  favFilter: "all" | "fav" = "all";
  status: "notes" | "trash" = "notes";

  constructor(private noteService: NoteListService) {
    this.noteList = this.getStatus();
  }


  getStatus(){
    if (this.status == 'notes') {
      if(this.favFilter == 'all'){ 
        return this.noteService.normalNotes; //zeige alle an
      } else {
        return this.noteService.normalMarkedNotes;//zeige nur die an, die den filter auf fav haben 
      }
      
    } else {
      return this.noteService.trashNotes;//zeige trash an
    } 
  }
  // getNotesList(): Note[]{
  //   return this.noteService.normalNotes;
  // }

  // getTrashList(): Note[]{
  //   return this.noteService.trashNotes;
  // }


  changeFavFilter(filter: "all" | "fav") { // vergebe den status vom filter durch onclick
    this.favFilter = filter;
  }

  changeTrashStatus() {
    if (this.status == "trash") {
      this.status = "notes";
    } else {
      this.status = "trash";
      this.favFilter = "all";
    }
  }


  // showTrashNotes(){
  //   if (this.status == "trash") {
  //     this.getTrashList();
  //   } else {
  //     this.getNotesList();
  //   }
  // }
}
