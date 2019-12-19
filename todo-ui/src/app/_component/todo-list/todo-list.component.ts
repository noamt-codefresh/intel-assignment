import { Component, OnInit } from '@angular/core';
import {TodoListService} from "../../_services/todo-list.service";
import {TodoList} from "../../_models/todo-list";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  private _todoLists: TodoList[];

  constructor(private _todoListService: TodoListService) { }

  ngOnInit() {
    this._todoListService.getTodoLists().subscribe(response => {
      this._todoLists = response;
    }, error => {
      console.error(error);
      alert(error.message);
    });

  }

}
