import {AfterViewInit, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TodoList, TodoListItem} from "../../_models/todo-list";
import {TodoListService} from "../../_services/todo-list.service";

@Component({
  selector: 'app-todo-list-items',
  templateUrl: './todo-list-items.component.html',
  styleUrls: ['./todo-list-items.component.css']
})
export class TodoListItemsComponent implements OnInit, AfterViewInit, OnChanges {

  items: TodoListItem[];
  @Input() todoList: TodoList;

  newItemName: string;
  editing: boolean = false;
  enableEditIndex = null;

  constructor(private _todoListService: TodoListService) { }

  ngOnInit() {
    const listId = this.todoList && this.todoList._id;
    if (!listId) {
      return;
    }

    this.getItems();

  }

  ngOnChanges(changes: SimpleChanges): void {
    const {todoList} = changes;
    if (!todoList){
      return;
    }

    const {currentValue, previousValue, firstChange} = todoList;
    if (firstChange || currentValue === previousValue){
      return;
    }

    this.getItems();
  }



  ngAfterViewInit() {

  }

  getItems() {
    this._todoListService.getTodoListItems(this.todoList._id).subscribe(response => {
      this.items = response;
    }, error => {
      console.error(error);
      alert(error.message);
    });
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
      this.editing = false;
      this.enableEditIndex = null;
    }, error => {
      console.error(error);
      alert(error.message);
    });
  }

  enableEditMethod(index: number) {
    this.editing = true;
    this.enableEditIndex = index;
  }

  deleteItem(itemId: string, index: number) {
    this._todoListService.deleteTodoListItem(this.todoList._id, itemId).subscribe(response => {
      console.log(`item: ${itemId} deleted successfully`);
      this.items.splice(index, 1);
    }, error => {
      console.error(error);
      alert(error.message);
    });
  }
}
