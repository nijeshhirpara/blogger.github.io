$(document).ready(function() {
  // Getting references to the name input and category container, as well as the table body
  var nameInput = $("#category-name");
  var categoryList = $("tbody");
  var categoryContainer = $(".category-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an category
  $(document).on("submit", "#category-form", handleCategoryFormSubmit);
  $(document).on("click", ".delete-category", handleDeleteButtonPress);

  // Getting the initial list of categories
  getCategories();

  // A function to handle what happens when the form is submitted to create a new category
  function handleCategoryFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      return;
    }
    // Calling the upsertCategory function and passing in the value of the name input
    upsertCategory({
      name: nameInput
        .val()
        .trim()
    });
  }

  // A function for creating an category. Calls getCategories upon completion
  function upsertCategory(categoryData) {
    $.post("/api/categories", categoryData)
      .then(getCategories);
  }

  // Function for creating a new list row for categories
  function createRow(categoryData) {
    var newTr = $("<tr>");
    newTr.data("category", categoryData);
    newTr.append("<td>" + categoryData.name + "</td>");
    if (categoryData.Posts) {
      newTr.append("<td> " + categoryData.Posts.length + "</td>");
    } else {
      newTr.append("<td>0</td>");
    }
    newTr.append("<td><a href='/blog?category_id=" + categoryData.id + "'>Go to Posts</a></td>");
    newTr.append("<td><a href='/cms?category_id=" + categoryData.id + "'>Create a Post</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-category'>Delete category</a></td>");
    return newTr;
  }

  // Function for retrieving categories and getting them ready to be rendered to the page
  function getCategories() {
    $.get("/api/categories", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createRow(data[i]));
      }
      renderList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of categories to the page
  function renderList(rows) {
    categoryList.children().not(":last").remove();
    categoryContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      categoryList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no categories
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create an category before you can create a Post.");
    categoryContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("category");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/categories/" + id
    })
      .then(getCategories);
  }
});
