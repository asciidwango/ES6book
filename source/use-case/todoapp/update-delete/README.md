---
author: azu
description: "Todoアプリの残りの機能である「Todoアイテムの更新」と「Todoアイテムの削除」を実装していきます。"
---

# Todoアイテムの更新と削除を実装する {#todo-item-update-and-delete}

このセクションではTodoアプリの残りの機能である「Todoアイテムの更新」と「Todoアイテムの削除」を実装していきます。

「Todoアイテムの更新」とは、チェックボックスをクリックして未完了だったらチェックを付けて完了済みに、逆完了済みのアイテムを未完了へとトグルする機能のことです。完了状態をTodoアイテムごとにもち、それぞれのTodoの進捗を管理できる機能です。

一方の「Todoアイテムの削除」はボタンをクリックしたらTodoアイテムを削除する機能です。
不要となったTodoを削除して完了済みのTodoを取り除くなどに利用できる機能です。

まずは「Todoアイテムの更新」から実装します。その後「Todoアイテムの削除」を実装していきます。

## Todoアイテムの更新 {#todo-item-update}

現時点ではTodoアイテムの完了済みかが表示されていません。
そのため、まずはTodoアイテムが完了済みかを表示する必要があります。
HTMLの[`<input type="checkbox">`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/Input/checkbox)要素を使いチェックボックスを表示し、Todoアイテムごとの完了状態を表現します。

`<input type="checkbox">`は`checked`属性がない場合はチェックが外れた状態のチェックボックスとなります。
一方`<input type="checkbox" checked>`のように`checked`属性がある場合はチェックがついたチェックボックスとなります。

![input要素のchecked属性の違い](./img/input-checkbox.png)

Todoアイテム要素である`<li>`要素中に次のように`<input>`要素を追加しチェックボックスを表示に追加します。
チェックボックスである`<input>`要素にはスタイルのために`class`属性を`checkbox`とします。
合わせて完了済みの場合は`<s>`要素を使い打ち消し線を表示しています。

[import marker:"checkbox",unindent:"true"](./add-checkbox/src/App.js)

`<input type="checkbox">`要素はクリックするとチェックの表示がトグルします。
しかし、モデルである`TodoItemModel`の`completed`プロパティの状態は自動では切り替わりません。
これにより表示とモデルの状態が異なってしまうという問題が発生します。

この問題は次のような操作をしてみると確認できます。

1. Todoアイテムを追加する
2. Todoアイテムのチェックボックスにチェックを付ける
3. 別の新しいTodoアイテムを追加する
4. すべてのチェックボックスのチェックがリセットされてしまう

この問題を避けるためにも、`<input type="checkbox">`要素がチェックされたらモデルの状態を更新する必要があります。

`<input type="checkbox">`要素はチェックされたときに`change`イベントをディスパッチします。
この`change`イベントをリッスン（listen）して、TodoItemモデルの状態を更新すればモデルと表示の状態を同期できます。

`input`要素からディスパッチされる`change`イベントをリッスンする処理は次のようにかけます。

まずは`todoItemElement`要素の下にある`input`要素を`querySelector`メソッドで探索します。
以前は`document.querySelector`で`document`以下からCSSセレクタにマッチする要素を探索していました。
`todoItemElement.querySelector`メソッドを使うことで、`todoItemElement`下にある要素だけを対象に探索できます。

見つけた`input`要素に対して`addEventListener`メソッドで`change`イベントが発生したときに呼ばれるコールバック関数を登録できます。この`addEventListener`メソッドは`XMLHttpRequest`の場合と同じくイベント名とコールバック関数を渡すことで、指定したイベントを受け取れます。（「[ユースケース: Ajax通信][]」を参照）

<!-- textlint-disable prh -->

このようなイベントが発生した際に呼ばれるコールバック関数のことを**イベントリスナー**（イベントをリッスンするものという意味）と呼びます。またイベントリスナーはイベントハンドラーとも呼ばれることがありますが、この書籍ではこの2つの言葉は同じ意味として扱います。

<!-- textlint-enable prh -->

<!-- doctest:disable -->
```js
const todoItemElement = element`<li><input type="checkbox" class="checkbox">${item.title}</input></li>`;
// クラス名checkboxを持つ要素を取得
const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
// `<input type="checkbox">`のチェックが変更されたときに呼ばれるイベントリスナーを登録
inputCheckboxElement.addEventListener("change", () => {
    // チェックボックスの表示が変わったタイミングで呼び出される処理
    // TODO: ここでモデルを更新する処理を呼ぶ
});
```

ここまでをまとめると、Todoアイテムの更新は次の2つのステップで実装できます。

1. `TodoListModel`に指定したTodoアイテムの更新処理を追加する
2. チェックボックスの`change`イベントが発生したら、モデルの状態を更新する

ここから実際にTodoアイテムの更新を`todoapp`プロジェクトに実装していきます。

###  `TodoListModel`に指定したTodoアイテムの更新処理を追加する {#TodoListModel-updateTodo}

まずは、`TodoListModel`に指定したTodoアイテムを更新する`updateTodo`メソッドを追加します。
`TodoListModel#updateTodo`メソッドは、指定したidと一致するTodoアイテムの完了状態(`completed`プロパティ)を更新します。

[import, marker:"add-point",unindent:"true"](./update-feature/src/model/TodoListModel.js)

### チェックボックスの`change`イベントが発生したら、Todoアイテムの完了状態を更新する {#onChange-update-model}

次に`input`要素の`change`イベントのリスナー関数で、Todoアイテムの完了状態を更新します。

`App.js`で`todoItemElement`の子要素として`checkbox`というクラス名をつけた`input`要素を追加します。
この`input`要素の`change`イベントが発生したら、`TodoListModel#updateTodo`メソッドを呼び出すようにします。
チェックがトグルするたびに呼び出されるので、`completed`には現在の状態を反転（トグル）した値を渡します。

[import, marker:"checkbox",unindent:"true"](./update-feature/src/App.js)

`TodoListModel#updateTodo`メソッド内では`emitChange`メソッドによって、`TodoListModel`の変更が通知されます。
これによって`TodoListModel#onChange`で登録されているイベントリスナーがよびだされ、表示が更新されます。

これで表示とモデルが同期でき「Todoアイテムの更新処理」が実装できました。

## 削除機能 {#delete}

次は「Todoアイテムの削除機能」を実装していきます。

基本的な流れは「Todoアイテムの更新機能」と同じです。
`TodoListModel`にTodoアイテムを削除する処理を追加します。
そして表示には削除ボタンを追加し、削除ボタンがクリックされたときの指定したTodoアイテムを削除する処理を呼び出します。

###  `TodoListModel`に指定したTodoアイテムの削除する処理を追加する {#TodoListModel-deleteTodo}

まずは、`TodoListModel`に指定したTodoアイテムを削除する`deleteTodo`メソッドを追加します。
`TodoListModel#deleteTodo`メソッドは、指定したidと一致するTodoアイテムを削除します。

`items`というTodoアイテムの配列から指定したidと一致するTodoアイテムを取り除くことで削除しています。

[import, marker:"add-point",unindent:"true"](./delete-feature/src/model/TodoListModel.js)

### 削除ボタンの`click`イベントが発生したら、Todoアイテムを削除する {#onChange-update-model}

次に`button`要素の`click`イベントのリスナー関数でTodoアイテムを削除する処理を呼び出します。

`App.js`で`todoItemElement`の子要素として`delete`というクラス名をつけた`button`要素を追加します。
この要素がクリック（`click`）されたときに呼び出されるイベントリスナーを`addEventListener`メソッドで登録します。
このイベントリスナーの中で`TodoListModel#deleteTodo`メソッドを呼び指定したidのTodoアイテムを削除します。

[import, marker:"checkbox",unindent:"true"](./delete-feature/src/App.js)

`TodoListModel#deleteTodo`メソッド内では`emitChange`メソッドによって、`TodoListModel`の変更が通知されます。
これにより表示が`TodoListModel`と同期するように更新され、表示からもTodoアイテムが削除できます。

これで「Todoアイテムの削除機能」が実装できました。

## まとめ {#conclusion}

このセクションでは次のことできるようになりました。

- [x] Todoアイテムの完了状態として`<input type="checkbox">`を表示に追加した
- [x] チェックボックスが更新時の`change`イベントのリスナー関数でTodoアイテムの更新した
- [x] Todoアイテムを削除するボタンとして`<button class="delete">x</button>`を表示に追加した
- [x] 削除ボタンの`click`イベントのリスナー関数でTodoアイテムを削除した
- [x] Todoアイテムの追加、更新、削除の機能が動作するのを確認できた

このセクションでTodoアプリに必要な要件が実装できました。

- [x] Todoアイテムを追加できる
- [x] Todoアイテムの完了状態を更新できる
- [x] Todoアイテムを削除できる

ここまでのTodoアプリは次のURLで確認できます。

- <https://jsprimer.net/use-case/todoapp/update-delete/delete-feature/>

最後のセクションでは、`App.js`のリファクタリングを行い継続的に開発できるアプリの作り方についてを見ていきます。

[ユースケース: Ajax通信]: ../../ajaxapp/xhr/#xml-http-request
