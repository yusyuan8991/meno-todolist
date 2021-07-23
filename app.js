let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  ///避免form被提交
  e.preventDefault();

  ///取得input內容
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMon = form.children[1].value;
  let todoDay = form.children[2].value;
  // console.log(todoText, todoMon + "/" + todoDay);

  if ((todoText === "") | (todoMon === "") | (todoDay === "")) {
    alert("請填寫內容");
    return;
  }

  //建立div.todo
  let todo = document.createElement("div");
  todo.classList.add("todo");

  let text = document.createElement("p");
  ///text為新增的p
  text.classList.add("text");
  ///text(p)設定class屬性為text
  text.innerText = todoText;
  ///把todoText裡面的文字丟進text裡面
  let time = document.createElement("p");
  time.classList.add("time");
  time.innerText = todoMon + "/" + todoDay;

  // console.log(text.innerText, time.innerText);
  ///可以測試有沒有讀取成功

  //text,time 加入todo 裡面
  todo.appendChild(text);
  todo.appendChild(time);

  ///建立完成按鈕
  let finish = document.createElement("button");
  finish.classList.add("finish");
  finish.innerHTML = '<i class="fas fa-check"></i>';
  finish.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
    ///toggle有就刪掉 沒有就加入
  });
  todo.style.animation = "scaleUp 0.3s forwards";

  ///建立刪除按鈕
  let trash = document.createElement("button");
  trash.classList.add("trash");
  trash.innerHTML = '<i class="fas fa-trash-alt"></i>';

  trash.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;

    ///當animation執行完後執行callback function再remve
    todoItem.addEventListener("animationend", () => {
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          ///item.todoText = myTodo.todoText
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
  });

  ///加入todo裡面
  todo.appendChild(finish);
  todo.appendChild(trash);

  ///設定myTodo的object 當setItem的key value
  let myTodo = {
    todoText: todoText,
    todoMon: todoMon,
    todoDay: todoDay,
  };

  let mylist = localStorage.getItem("list");
  if (mylist == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(mylist);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
    ///如果localStorag裡面有存過的東西的話
    ///就先把把東西拿出來parse(string=>array)
    ///再push進去myTodo 這個object裡面
    ///最後一樣setItem進去
  }

  console.log(JSON.parse(localStorage.getItem("list")));

  ///清除input裡面的文字
  form.children[0].value = "";
  form.children[1].value = "";
  form.children[2].value = "";

  //再把todo加入section 就可以顯示出來
  section.appendChild(todo);
});

loadData();

function loadData() {
  ///顯示localStorage裡面的東西
  let mylist = localStorage.getItem("list");
  if (mylist !== null) {
    let myListArray = JSON.parse(mylist);
    myListArray.forEach((item) => {
      ///再creat todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("text");
      text.innerText = item.todoText; ///記得是跟item的屬性todoText拿
      let time = document.createElement("p");
      time.classList.add("time");
      time.innerText = item.todoMon + "/" + item.todoDay;

      todo.appendChild(text);
      todo.appendChild(time);

      let finish = document.createElement("button");
      finish.classList.add("finish");
      finish.innerHTML = '<i class="fas fa-check"></i>';
      finish.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
        ///toggle有就刪掉 沒有就加入
      });
      todo.style.animation = "scaleUp 0.3s forwards";

      ///建立刪除按鈕
      let trash = document.createElement("button");
      trash.classList.add("trash");
      trash.innerHTML = '<i class="fas fa-trash-alt"></i>';

      trash.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        // console.log(e.target.parentElement);

        ///當animation執行完後執行callback function再remve
        todoItem.addEventListener("animationend", () => {
          ///remove from localstorage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              ///item.todoText = myTodo.todoText
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          todoItem.remove();
        });

        todoItem.style.animation = "scaleDown 0.3s forwards";
      });

      ///加入todo裡面
      todo.appendChild(finish);
      todo.appendChild(trash);

      section.appendChild(todo);
    });
  }
}

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMon) > Number(arr2[j].todoMon)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMon) < Number(arr2[j].todoMon)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMon) == Number(arr2[j].todoMon)) {
      if (Number(arr1[i].todoDay) > Number(arr2[j].todoDay)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr3) {
  if (arr3.length === 1) {
    return arr3;
  } else {
    let middle = Math.floor(arr3.length / 2);
    let right = arr3.slice(0, middle);
    let left = arr3.slice(middle, arr3.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

// console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

let sort = document.querySelector("div.sort");
sort.addEventListener("click", () => {
  ///sort data
  let sortArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortArray));

  let len = section.children.length;
  // console.log(len);
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
    ///設定children[0]是因為 [0]被刪除之後 會補新的array 再把[0]刪掉 再繼續 會一個一個刪除
  }
  ///loadData
  loadData();
});
