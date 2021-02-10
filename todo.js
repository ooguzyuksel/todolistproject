// 1.Adım - Tüm Elemenleri Seçmek

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventListeners(); // EventListener fonksiyonunu çağırdık.



//2. Adım - ToDo Ekleyeceğimiz için Submit olayı kazandırma - eventlistener

function eventListeners() { //Tüm event listenerlar
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);


}
//Tüm Taskları Temizleme
function clearAllTodos(e) {
    if (confirm("Tümünü Silmek İstediğinize Emin Misiniz ?")) {
        //Arayüzden TÜM ToDo'ları temizleme!
        // todoList.innerHTML = "";//Yavaö Yöntem - While daha iyi

        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }

        localStorage.removeItem("todos");
    }
}

//Filter İşlemi
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();

        if (text.indexOf(filterValue) === -1) {//Bulamadı
            listItem.setAttribute("style", "display:none !important");
        }
        else {
            listItem.setAttribute("style", "display:block");
        }

    });
}

//Arayüzden To&Do'yu Silme
function deleteTodo(e) {
    // console.log(e.target);
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "To & Do Başarıyla Silindi");
    }
}

//To & Do'ları Localstorage'dan Silme

function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1);//Arrayden değer sildirme.
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));

}

function addTodo(e) {
    let todos = getTodosFromStorage();
    const newTodo = todoInput.value.trim(); // Inputa girilen bilgiyi aldık - trim() önemli
    let isThere = false;
    todos.forEach(function (alreadyHaveThisItem) {
        if (alreadyHaveThisItem.indexOf(newTodo) != -1) {
            isThere = true;
        }
    });


    if (newTodo === "") {

        showAlert("danger", "Lütfen bir To & Do girin...");
    }
    else if (isThere == true) {
        showAlert("warning", "Bu To & Do'yu daha önce eklediniz!");
    }
    else {

        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "To & Do: ' " + newTodo + " ' Başarıyla Eklendi!");
    }

    //Default reload'ı kaldırma
    e.preventDefault();
}

function getTodosFromStorage() { //Storage'dan Bütün todoları alma
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

// Local Storage'a Todoları Ekleme
function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}


//Todo'ları Local Storage'dan alma - Sayfa yüklendikten sonra ( DOMContentLoaded )
function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);

    });
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;


    firstCardBody.appendChild(alert);

    //1 saniye sonra silme işlemi - window.setTimeout()

    setTimeout(function () { // ( fonksiyon alır, çalışma zamanını alır )
        alert.remove();
    }, 2500); // 
}

function addTodoToUI(newTodo) { // Bu Fonksiyon string değeri - List item olarak UI'a ekleyecek
    // Dinamik olarak yorumlu yeri oluşturacağız.

    //List item oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";

    //Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";

    //İçerikleri Oluşturma
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //ToDo Liste İçeriği / ListItem'ı ekleme
    todoList.appendChild(listItem);

    //Input'un içini boşaltıyor
    todoInput.value = "";
}