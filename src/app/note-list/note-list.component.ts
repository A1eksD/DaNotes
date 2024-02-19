import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service'


@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent {
  // noteList: Note[] = [];
  favFilter: "all" | "fav" = "all";
  status: "notes" | "trash" = "notes";

  constructor(private noteService: NoteListService) {
    // this.noteList = this.getNotesList();
  }

  getStatus(){
    if (this.status != 'trash') {
      return this.noteService.normalNotes;
    } else {
      return this.noteService.trashNotes;
    }
  }
  // getNotesList(): Note[]{
  //   return this.noteService.normalNotes;
  // }

  // getTrashList(): Note[]{
  //   return this.noteService.trashNotes;
  // }


  changeFavFilter(filter: "all" | "fav") {
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
