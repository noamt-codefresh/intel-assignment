import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TodoListService} from "../../_services/todo-list.service";
import {TodoList} from "../../_models/todo-list";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, AfterViewInit {

  todoLists: TodoList[];
  newTodoListName:string;
  currentTodoList: TodoList;

  constructor(private _todoListService: TodoListService) {
  }

  ngOnInit() {
    this._todoListService.getTodoLists().subscribe(response => {
      this.todoLists = response;
      if (this.todoLists && this.todoLists.length === 0) {
        return;
      }

      this.currentTodoList = this.todoLists[0];
      //TODO: get first list items for detail view and update current todo list
    }, error => {
      console.error(error);
      alert(error.message);
    });

  }

  ngAfterViewInit() {

  }

  createTodoList(todoListName: string) {
    this._todoListService.createTodoList(todoListName).subscribe(response => {
      this.currentTodoList = response;
      this.todoLists.push(this.currentTodoList);
    }, error => {
      console.error(error);
      alert(error.message);
    });
  }

  isActive(todoList: TodoList, index: number): boolean {
    if (!this.currentTodoList && index === 0) {
      return true;
    }

    return todoList._id === this.currentTodoList._id;
  }


  onListSelect(todoList: TodoList) {
    this.currentTodoList=todoList;
  }
}
