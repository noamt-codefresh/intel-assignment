import {AfterViewInit, Component, Input, NgZone, OnInit} from '@angular/core';
import {TodoList, TodoListItem} from "../../_models/todo-list";
import {TodoListService} from "../../_services/todo-list.service";

@Component({
  selector: 'app-todo-list-items',
  templateUrl: './todo-list-items.component.html',
  styleUrls: ['./todo-list-items.component.css']
})
export class TodoListItemsComponent implements OnInit, AfterViewInit {

  items: TodoListItem[];
  @Input() todoList: TodoList;

  newItemName: string;
  editingName: boolean = false;

  constructor(private _todoListService: TodoListService) { }

  ngOnInit() {
    const listId = this.todoList && this.todoList._id;
    if (!listId) {
      return;
    }

    this._todoListService.getTodoListItems(listId).subscribe(response => {
      this.items = response;
    }, error => {
      console.error(error);
      alert(error.message);
    });

  }



  ngAfterViewInit() {

  }

  createItem(newItemName: string) {
    const todoListItem = {name: newItemName, done: false};
    this._todoListService.createTodoListItem(this.todoList._id, todoListItem).subscribe(response => {
      this.items.push(response);
    }, error => {
      console.error(error);
      alert(error.message);
    });
  }

  toggleDone(e: any, item) {
    item.done = e.target.checked;
    this._todoListService.updateTodoListItem(this.todoList._id, item).subscribe(response => {
      console.log(`item: ${item._id} updated successfully`);
    }, error => {
      item.done = !e.target.checked;
      console.error(error);
      alert(error.message);
    });

  }

  updateItemName(item: TodoListItem) {
    this._todoListService.updateTodoListItem(this.todoList._id, item).subscribe(response => {
      console.log(`item: ${item._id} updated successfully`);
      this.editingName = false;
    }, error => {
      console.error(error);
      alert(error.message);
    });
  }
}
