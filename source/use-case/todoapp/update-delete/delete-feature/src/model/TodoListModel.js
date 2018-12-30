import { EventEmitter } from "../EventEmitter.js";

export class TodoListModel extends EventEmitter {
    /**
     * @param {TodoItemModel[]} [items] 初期アイテム一覧（デフォルトは空の配列）
     */
    constructor(items = []) {
        super();
        this.items = items;
    }

    /**
     * TodoItemの合計数を返す
     * @returns {number}
     */
    get totalCount() {
        return this.items.length;
    }

    /**
     * 表示できるTodoItemの配列を返す
     * @returns {TodoItemModel[]}
     */
    getTodoItems() {
        return this.items;
    }

    /**
     * TodoListの状態が更新されたときに呼び出されるリスナー関数を登録する
     * @param {Function} listener
     * @returns {Function} イベントリスナーの登録を解除する関数を返す
     */
    onChange(listener) {
        this.addEventLister("change", listener);
        return () => {
            this.removeEventLister("change", listener);
        };
    }

    /**
     * 状態が変更されたときに呼ぶ。登録済みのリスナー関数を呼び出す
     */
    emitChange() {
        this.emit("change");
    }

    /**
     * TodoItemを追加する
     * @param {TodoItemModel} todoItem
     */
    addTodo(todoItem) {
        this.items.push(todoItem);
        this.emitChange();
    }

    /**
     * 指定した`id`のTodoItemの`completed`を更新する
     * @param {{ id:number, completed: boolean }}
     */
    updateTodo({ id, completed }) {
        const todoItem = this.items.find(todo => todo.id === id);
        if (!todoItem) {
            return;
        }
        todoItem.completed = completed;
        this.emitChange();
    }

    //! [add-point]
    // ===============================
    // TodoItemModel.jsの既存の実装は省略
    // ===============================
    /**
     * 指定したidのTodoItemを削除する
     * @param {{ id: number }}
     */
    deleteTodo({ id }) {
        // `id`が一致するTodoItemを`this.items`から取り除き、削除する
        this.items = this.items.filter(todo => {
            return todo.id !== id;
        });
        this.emitChange();
    }
}
//! [add-point]
