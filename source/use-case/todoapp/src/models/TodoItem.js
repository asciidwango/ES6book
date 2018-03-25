// MIT © 2018 azu
"use strict";
// unique id
let todoIdx = 0;

export class TodoItem {
    constructor({ title, completed }) {
        this.id = todoIdx++;
        this.title = title;
        this.completed = completed;
    }
}
