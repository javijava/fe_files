(function () {
  if (!localStorage.getItem('list_items')) {
    var list_items = [{
      "img_item": "http://via.placeholder.com/320x320",
      "txt_item": "ITEM 1"
    },
      {
        "img_item": "http://via.placeholder.com/320x320",
        "txt_item": "ITEM 2"
      }];
    localStorage.setItem("list_items", JSON.stringify(list_items));
  }

  list = document.getElementById('sortable');

  var image_src = '';

  function upload(image) {
    var idValue = image[0].getAttribute('id');
    var fileInput = image;
    var idPr = (idValue == 'fileInputImageEdit') ? 'preimageEdit' : 'preimage';
    var fileDisplayArea = document.getElementById(idPr);
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var _URL = window.URL || window.webkitURL;
      var file = fileInput[0].files[0];
      var imageType = /image.*/;
      if (file.type.match(imageType)) {

        var img = new Image();
        img.onload = function () {
          if (this.width != 320 && this.height != 320) {
            alert('The image must be 320x320 99');
            document.getElementById(idValue).value = "";
            if (idValue == 'fileInputImage') {
              fileDisplayArea.innerHTML = "";
            }
            return false;
          } else {
            var imgPreview = new Image('100', '100');
            fileDisplayArea.innerHTML = "";
            imgPreview.src = reader.result;
            imgPreview.src = _URL.createObjectURL(file);
            fileDisplayArea.appendChild(imgPreview);

          }
        };
        var reader = new FileReader();
        reader.onload = function (e) {

          //alert("llega");
          img.src = reader.result;
          image_src = reader.result;
        }
        reader.readAsDataURL(file);
      } else {
        alert("The file must be a image");
        fileDisplayArea.innerHTML = "";
        clean_fields();
      }
    }
  }

  // Add functionality sortable to list
  var sorted = $("#sortable").sortable({
    update: function () {
      saveList();
    }
  });

  var container = document.getElementById('sortable');
  var items = JSON.parse(localStorage.getItem('list_items'));
  Array.prototype.forEach.call(items, function (e) {
    container.innerHTML += "<li><img src='" + e.img_item + "'><h4>" + e.txt_item + "</h4><h5><div class='actions'><span class='edit' data-toggle='modal' data-target='#myModalEdit'>edit</span> / <span class='delete'>delete</span></div></h5></li>";
  });

  // Save function
  function saveList() {
    var itemList = document.getElementsByTagName('li');
    var currentList = [];
    Array.prototype.forEach.call(itemList, function (e) {
      var currentImg = e.getElementsByTagName('img')[0].src;
      var currentTxt = e.getElementsByTagName('h4')[0].textContent;
      currentList.push({
        'img_item': currentImg,
        'txt_item': currentTxt
      });
    });
    localStorage.setItem("list_items", JSON.stringify(currentList));
  }

  var newImage = $('#fileInputImage');
  var editImage = $('#fileInputImageEdit');
  var _URL = window.URL || window.webkitURL;

  newImage.on('change', function () {
    upload($(this));
  });
  editImage.on('change', function () {
    upload($(this));
  });

  var save = document.getElementById('save_item');
  var newTxt = document.getElementById('fileInputText');
  var list = document.getElementById('sortable');
  var preimage = document.getElementById('preimage');

  save.addEventListener('click', function () {
    var item_text = document.getElementById('fileInputText');
    if (item_text.value.length < 3 ||
      item_text.value.length > 300) {
      alert('The description must not exceed 300 characters');
      item_text.value = "";
      document.getElementById('fileInputImage').value = ""
      return;
    }
    if (typeof image_src !== 'undefined' && image_src != '') {
      var img_src = image_src;
    } else {
      alert('You must upload a image');

      return false;
    }
    window.scrollTo(0, document.body.scrollHeight);
    list.innerHTML += "<li><img src='" + img_src + "'><h4>" + newTxt.value + "</h4><h5><div class='actions'><span class='edit' data-toggle='modal' data-target='#myModalEdit'>edit</span> / <span class='delete'>delete</span></div></h5></li>";
    getCountItems();
    deleteItem();
    editItem();
    saveList();
    clean_fields();
  });

  // Edit an item
  var editForm = document.getElementById('form_edit');

  function editItem() {
    var edit = document.getElementsByClassName('edit');
    Array.prototype.forEach.call(edit, function (el) {
      el.addEventListener('click', function () {
        var item_edit_text = document.getElementById('fileInputTextEdit');
        var item_edit_img = document.getElementById('fileInputImageEdit');
        var current_item = el.parentElement.parentElement.parentElement;
        var current_img = current_item.getElementsByTagName('img')[0].src;
        var current_text = current_item.getElementsByTagName('h4')[0].textContent;
        item_edit_text.value = current_text;
        $('#preimageEdit').append("<img src='" + current_img + "' width='100' height='100'/>");
        var update = document.getElementById('update_item');
        update.addEventListener('click', function () {
          if (item_edit_text.value.length < 3 ||
            item_edit_text.value.length > 300) {
            alert('The description must not exceed 300 characters');
            item_edit_text.value = "";
            return;
          }
          if (typeof image_src !== 'undefined' &&
            image_src != '') {
            var img = image_src;
          } else {
            var img = current_img;
          }
          $('#preimageEdit').html("");
          list.removeChild(el.parentElement.parentElement.parentElement);
          list.innerHTML += "<li><img src='" + img + "'><h4>" + item_edit_text.value + "</h4><h5><div class='actions'><span class='edit' data-toggle='modal' data-target='#myModalEdit'>edit</span> / <span class='delete'>delete</span></div></h5></li>";
          getCountItems();
          deleteItem();
          saveList();
          editItem();
          clean_fields();
        }, false);
      }, false);
    });
  }

  editItem();

  // Clean fields form
  function clean_fields() {
    document.getElementsByTagName('input').value = "";
    $('form')[0].reset(); // Reset all form fields
    preimage.innerHTML = "";
  }

  clean_fields();

  // Delete from list
  function deleteItem() {
    var del = document.getElementsByClassName('delete');
    Array.prototype.forEach.call(del, function (el) {
      el.addEventListener('click', function () {
        list.removeChild(el.parentElement.parentElement.parentElement);
        getCountItems();
        saveList();
      }, false);
    });
  }

  deleteItem();

  // Show all items number
  function getCountItems() {
    var count_items = document.getElementById('total_items');
    count_items.innerHTML = container.getElementsByTagName('li').length;
  }

  getCountItems();

  // function close modal forms
  $('.close, .close_footer').on('click', function () {
    $('form')[0].reset();
    $('#preimage').html("");
  });
  $('.close_edit, .close_footer_edit').on('click', function () {
    $('#preimageEdit').html("");
  });
})();
