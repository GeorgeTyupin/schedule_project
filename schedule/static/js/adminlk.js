data = {};
/*
========================================================================================================
РАБОТА НА СТРАНИЧКЕ
======================================================================================================== 
*/

var days = new Vue({
   el: '#prev',
   data: {
      days : [
      {
         day : 'Понедельник',
         tasks : [],
         id: 1
      },
      {
         day : 'Вторник',
         tasks : [],
         id: 2
      },
      {
         day : 'Среда',
         tasks : [],
         id: 3
      },
      {
         day : 'Четверг',
         tasks : [],
         id: 4
      },
      {
         day : 'Пятница',
         tasks : [],
         id: 5
      },
      {
         day : 'Суббота',
         tasks : [],
         id: 6
      },
      {
         day : 'Воскресенье',
         tasks : [],
         id: 7
      }
     ]
   }
 });

function dayOpenClose(target) {
   events = $($(target).children()).children();
   if (target.className == 'day') {
      target.classList.add('open-day');
      $(target).children()[1].classList.remove('hide');
      for (let i = 0; i < events.length; i++) {
         events[i].classList.remove('hide');
      }
   } else {
      $(target).children()[1].classList.add('hide');
      for (let i = 0; i < events.length; i++) {
         events[i].classList.add('hide');
      }
      target.classList.remove('open-day');   
   }
}

function createEventArea(event, day) {
   document.body.style.overflow = "hidden";
   document.querySelector('.background-form').classList.remove('hide');
   if (event.target.classList.contains('create-event')) {
      document.querySelector('.event-area').classList.remove('hide');
   } else {
      document.querySelector('.event-day-area').classList.remove('hide');
   }
   $('.form-submit').off('click');
   $('.form-submit').click(closeEventArea);
   $('.form-submit').click( () => {
      addEvent(day);
   });
}

function closeEventArea() {
   document.body.style.overflow = "visible";
   document.querySelector('.background-form').classList.add('hide');
   document.querySelector('.event-area').classList.add('hide');
   document.querySelector('.event-day-area').classList.add('hide');
   document.querySelector('.event-change-area').classList.add('hide');
   document.querySelector('.show-event').classList.add('hide');
   document.querySelector('.add-category-area').classList.add('hide');
}

function addEvent(day) {
   if ($(event.target).parent()[0].classList.contains('event-day-area')) {
      data['event_day'] = day;
      data['event_name'] = $($(event.target).parent()[0]).children()[1].value;
   } else {
      data['event_day'] = document.querySelector('.form-input-day').value;
      data['event_name'] = document.querySelector('.form-input-name').value;
   }
   data['event-description'] = document.querySelector('.form-description').value;
   document.querySelectorAll('.day').forEach((day_elem) => {
      console.log(day_elem.childNodes[0].innerText.toLowerCase().trim())
      console.log(data['event_day'].toLowerCase())
     if (day_elem.childNodes[0].innerText.toLowerCase() == data['event_day'].toLowerCase().trim()) {
        if (!day_elem.classList.contains('open-day')) {
           dayOpenClose(day_elem);
        }
        sendingEvents(data);
        console.log(day_elem.childNodes[3])
        $(day_elem.childNodes[4]).append(`<div class="event">${data['event_name']}</div>`);
     };
  });
}

function showEvent(event_target) {
   document.body.style.overflow = "hidden";
   document.querySelector('.background-form').classList.remove('hide');
   document.querySelector('.show-event').classList.remove('hide');
   document.querySelector('.event-title').innerHTML = $(event_target).attr('data-name');
   document.querySelector('.event-description').innerHTML = $(event_target).attr('data-description');
   data['event_id'] = $(event_target).attr('data-id');
   $('.show-change-event-area').click(() => {
      createChangeEventArea(event_target);
   });
   $('.event-detele').click(() => {
      data['event_id'] = $(event_target).attr('data-id');
      deleteEvent(data);
   });
}

function createChangeEventArea(event_target) {
   document.querySelector('.show-event').classList.add('hide');
   document.querySelector('.event-change-area').classList.remove('hide');
   data['changed_description'] = $(event_target).attr('data-description');
   $('.change-event').click(() => {
      changeEvent(event_target);
   });
}

function changeEvent(event) {
   event.innerText  = document.querySelector('.form-change-name').value;
   data['event_id'] = $(event).attr('data-id');
   data['changed_name'] = document.querySelector('.form-change-name').value;
   data['changed_description'] = document.querySelector('.form-change-description').value;
   $(event).attr('data-name', document.querySelector('.form-change-name').value);
   document.querySelector('.event-change-area').classList.add('hide');
   sendingChangedEvents(data);
}

function createCategory() {
   $('.categories').append(`<div class="menu_class-1 btn">
                              <input class="menu-filter-name" type="text" placeholder="Название"></input>
                              <img class="menu-check-mark" src="../static/img/checkmark.png" alt="" srcset="">
                              <div class="menu-cross"></div>
                           </div>`);
   $('.menu-check-mark').click(saveCategory);
}

function saveCategory(event) {
   console.log(12)
   current_category = $(event.target).parent()[0];
   $(current_category).children()[0].classList.add('hide');
   $(current_category).children()[1].classList.add('hide');
   data['category_name'] = $(current_category).children()[0].value;
   $(current_category).prepend(`<p class="menu_class_text">${data['category_name']}</p>`);
   sendingCategory(data);
}

function createAddEventArea() {
   document.querySelector('.show-event').classList.add('hide');
   document.querySelector('.add-category-area').classList.remove('hide');
   getCategories(2);
}



/*
========================================================================================================
РЕНДЕРИНГ ДАННЫХ С СЕРВЕРА НА СТРАНИЧКЕ
========================================================================================================
*/
function renderEvents(response) {
   response.forEach((event) => {
      document.querySelectorAll('.day').forEach((day) => {
         if (day.childNodes[0].innerText.toLowerCase() == event[3].toLowerCase()) {
            $(day.childNodes[4]).append(`<div class="event hide" data-id="${event[0]}" data-name="${event[1]}" data-description="${event[5]}">${event[1]}</div>`);
         };
      });
   });
}

function renderCategories(response, param) {
   counter = 1
   categories = $('.categories');
   categories_list = $('.categories-list');
   categories_list.html('');
   response.forEach((category) => {
      if (param == 1) {
         categories.append(`<div class="menu_class-1 btn"><p class="menu_class_text">${category[2]}</p></div>`)
      } else {
         categories_list.append(`<div class="category-wrap" category-id="${category[0]}">
            <input type="checkbox" name="" id="checkbox-category-${counter}" class="checkbox-category-input">
            <label for="checkbox-category-${counter}" class="checkbox-category-label">${category[2]}</label>
         </div>`);
      }
      counter += 1
   });
}



/*
========================================================================================================
РАБОТА С СЕРВЕРОМ
========================================================================================================
*/
function sendingEvents(data) {
   $.post("/", data, success = function(response) {});
}

function sendingCategory(data) {
   console.log(data['category_name']);
   $.post("/create_category", data, success = function(response) {});
}

function deleteEvent(data) {
   $.post("/delete_event", data, success = function(response) {
      console.log(response)
      const id = `${response['event_id']}`
      document.querySelector('.background-form').classList.add('hide');
      document.querySelector('.show-event').classList.add('hide');
      ev = document.querySelector(`div[data-id=${id}]`)
      $(ev).remove()
   });
}

function sendingChangedEvents(data) {
   console.log(data['changed_name'])
   $.post("/changing_events", data, success = function(response) {});
}

function getData() {
   $.post("/get_data", 'hello', success = function(response) {
      renderEvents(JSON.parse(response));
      clickOnEvents();
	});
   getCategories(1);
   main();
}

function getCategories(param) {
   $.post("/get_categories", 'hello', success = function(response) {
      renderCategories(JSON.parse(response), param);
	});
}

function signOut() {
   $.post("/exit", data, success = function(response) {
      document.location.href = "/auth"
   });
}

function sendingAddedCategories() {
   data['category_ids'] = [];
   document.querySelectorAll('.category-wrap').forEach((category) => {
      if ($(category).children()[0].checked) {
         data['category_ids'].push($(category).attr('category-id'))
      }
   });
   console.log(data)
   $.post("/get_categories_and_events", data, success = function(response) {});
}



/*
========================================================================================================
ВЫЗОВ ФУНКЦИЙ
========================================================================================================
*/
function clickOnEvents() {
   $('.event').click(function(event) {
      event.stopPropagation();
      showEvent(event.target);
   });
}

function main() {
   document.querySelectorAll('.day').forEach((day) => {
      day.addEventListener('click', () => {
         dayOpenClose(day);
      });
   });
   $('.create-event').click(createEventArea);
   $('.create-event-day').click(() => {
      day = $($(event.target).parent()[0]).children()[0].innerHTML;
      createEventArea(event, day);
   });
   $('.form-close').click(closeEventArea);
   $('.exit').click(signOut);
   $('.menu_add_class').click(createCategory);
   $('.add-category').click(createAddEventArea);
   $('.sending-added-categories').click(sendingAddedCategories);
}

document.addEventListener('DOMContentLoaded', getData);