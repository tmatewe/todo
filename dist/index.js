let form = document.querySelector("#formAdd");
let formUpdate = document.querySelector("#formUpdate");
let todolists = document.querySelector("#myUL");
let importantId = document.querySelector("#importantId");

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("clicked");
  db.collection("todos")
    .add({
      todo: form.myInput.value,
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  form.myInput.value = "";
});
//get todo function
const getTodo = (doc) => {
  todolists.innerHTML += `<tr data-id='${doc.id}'>
    <td id="main-row">${doc.data().todo}</td>
    <td>
      <button class="btn btn-outline-danger btn-sm btn-delete">delete</button>
      <button class="btn btn-outline-info btn-sm btn-edit">edit</button>
    </td>
  </tr>`;
};

todolists.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let idDelete = e.target.parentElement.parentElement.getAttribute("data-id");
    db.collection("todos")
      .doc(idDelete)
      .delete()
      .then(() => {
        console.log("Document succesfully deleted!");
      })
      .catch((err) => {
        console.log("Error removing document", err);
      });
  }
  if (e.target.classList.contains("btn-edit")) {
    modal.style.display = "block";
    let idEdit = e.target.parentElement.parentElement.getAttribute("data-id");
    importantId.value = idEdit;
    console.log(idEdit);
    db.collection("todos")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (idEdit == doc.id) {
            formUpdate.myInput.value = doc.data().todo;
          }
        });
      });
  }
});
// db.collection("todos")
//   .get()
//   .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       getTodo(doc);
//     });
//   });

// Real time listener
db.collection("todos").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      getTodo(change.doc);
    }
    if (change.type === "removed") {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      todolists.removeChild(tbody);
    }
    if (change.type === "modified") {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      todolists.removeChild(tbody);
      getTodo(change.doc);
    }
  });
});

formUpdate.addEventListener("submit", (e) => {
  modal.style.display = "none";
  e.preventDefault();
  db.collection("todos")
    .doc(importantId.value)
    .update({
      todo: formUpdate.myInput.value,
      capital: true,
    })
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });

  formUpdate.myInput.value = "";
});
