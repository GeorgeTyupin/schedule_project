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
         mark : "Mon",
         date: '',
         id: 0
      },
      {
         day : 'Вторник',
         mark : "Tue",
         date: '',
         id: 1
      },
      {
         day : 'Среда',
         mark : "Wed",
         date: '',
         id: 2
      },
      {
         day : 'Четверг',
         mark : "Thu",
         date: '',
         id: 3
      },
      {
         day : 'Пятница',
         mark : "Fri",
         date: '',
         id: 4
      },
      {
         day : 'Суббота',
         mark : "Sat",
         date: '',
         id: 5
      },
      {
         day : 'Воскресенье',
         mark : "Sun",
         date: '',
         id: 6
      }
     ]
   }
 });

class schedule {
   constructor() {
      this.date = new Date();
      console.log('Create new schedule');
      this.date_string = this.date.toString();
      this.current_day = this.date.getDate();
      this.current_day_id = 0;
      this.events = [];
      this.mounth_list = {
         'Jan' : ['Января', 32 - new Date(this.date.getFullYear(), 0, 32).getDate()],
         'Feb' : ['Февраля', 32 - new Date(this.date.getFullYear(), 1, 32).getDate()],
         'Mar' : ['Марта', 32 - new Date(this.date.getFullYear(), 2, 32).getDate()],
         'Apr' : ['Апреля', 32 - new Date(this.date.getFullYear(), 3, 32).getDate()],
         'May' : ['Мая', 32 - new Date(this.date.getFullYear(), 4, 32).getDate()],
         'Jun' : ['Июня', 32 - new Date(this.date.getFullYear(), 5, 32).getDate()],
         'Jul' : ['Июля', 32 - new Date(this.date.getFullYear(), 6, 32).getDate()],
         'Aug' : ['Августа', 32 - new Date(this.date.getFullYear(), 7, 32).getDate()],
         'Sep' : ['Сентября', 32 - new Date(this.date.getFullYear(), 8, 32).getDate()],
         'Oct' : ['Октября', 32 - new Date(this.date.getFullYear(), 9, 32).getDate()],
         'Nov' : ['Ноября', 32 - new Date(this.date.getFullYear(), 10, 32).getDate()],
         'Dec' : ['Декабря', 32 - new Date(this.date.getFullYear(), 11, 32).getDate()]
      };
      this.setDateInDayElem();
      this.replaceDays();
      console.log(this.date_string)
   }

   setCurrentDay() {
      days.days.forEach((day) => {
         if (day['mark'] == this.date_string.slice(0, 3)) {
            this.current_day_id = day['id'];
         }
      });
      document.querySelectorAll('.day').forEach((day_elem) => {
         if ($(day_elem).attr('day-date') == this.date_string.slice(4, 10)) {
            this.current_day_elem = day_elem;
            checkDayOpenClose(this.current_day_elem);
         }
      });
   }

   setDateInDayElem() {
      let mounth = this.mounth_list[`${this.date_string.slice(4, 7)}`][0];
      let attr_mounth = Object.keys(this.mounth_list)[Object.keys(this.mounth_list).indexOf(`${this.date_string.slice(4, 7)}`)];
      let day = this.date_string.slice(8, 10);
      if (day.slice(0, 1) == '0') {
         day = day.slice(1, 2)
      }
      let date_counter = day;
      document.querySelectorAll('.day-date').forEach((day_date) => {
         let day_elem = $($(day_date).parent()).parent()[0];
         day_date.innerHTML = date_counter + ' ' + mounth; 
         $(day_elem).attr('day-date', attr_mounth + ' ' + date_counter);
         if (date_counter < this.mounth_list[`${this.date_string.slice(4, 7)}`][1]) {
            date_counter++;
         } else {
            date_counter = 1;
            if (attr_mounth == 11) {
               attr_mounth = 1;
            } else {
               attr_mounth = Object.keys(this.mounth_list)[Object.keys(this.mounth_list).indexOf(`${this.date_string.slice(4, 7)}`) + 1];
            }
            mounth = this.mounth_list[`${attr_mounth}`][0];
         }
      });
   }

   replaceDays() {
      days.days.slice(0, this.current_day_id).forEach((day) => {
         days.days.shift();
         days.days.push(day);
      });
   }

   setPreviousWeek() {
      let previous_week_current_day = this.current_day - 7;
      let previous_week_current_mounth_id = Object.keys(this.mounth_list).indexOf(`${this.date_string.slice(4, 7)}`);
      let previous_week_current_year = this.date_string.slice(11, 15);
      if (previous_week_current_day <= 0 ) {
         if (previous_week_current_mounth_id == 0) {
            previous_week_current_mounth_id = 11;
            previous_week_current_year -= 1; 
         } else {
            previous_week_current_mounth_id -= 1;
         }
         previous_week_current_day = this.mounth_list[`${Object.keys(this.mounth_list)[previous_week_current_mounth_id]}`][1] - 7;
      }
      this.date = new Date(previous_week_current_year, previous_week_current_mounth_id, previous_week_current_day);
      this.date_string = this.date.toString();
      this.setDateInDayElem();
      this.replaceDays();
      this.updateEventsInWeek()
   }

   setCurrentWeek() {
      this.date = new Date();
      this.date_string = this.date.toString();
      this.setDateInDayElem();
      this.replaceDays();
      this.updateEventsInWeek();
      dayOpen(this.current_day_elem, $($(this.current_day_elem).children()[2]).children());
   }

   setNextWeek() {
      let next_week_current_day = this.current_day + 7;
      let next_week_current_mounth_id = Object.keys(this.mounth_list).indexOf(`${this.date_string.slice(4, 7)}`);
      let next_week_current_year = this.date_string.slice(11, 15);
      if (next_week_current_day > this.mounth_list[`${Object.keys(this.mounth_list)[next_week_current_mounth_id]}`] ) {
         if (next_week_current_mounth_id == 11) {
            next_week_current_mounth_id = 0;
            next_week_current_year += 1; 
         } else {
            next_week_current_mounth_id += 1;
         }
         next_week_current_day = 1;
      }
      this.date = new Date(next_week_current_year, next_week_current_mounth_id, next_week_current_day);
      this.date_string = this.date.toString();
      this.setDateInDayElem();
      this.replaceDays();
      this.updateEventsInWeek()
   }

   updateEventsInWeek() {
      $('.event').remove();
      dayClose(this.current_day_elem, $($(this.current_day_elem).children()[2]).children());
      renderEvents(this.events);
      clickOnEvents();
   }
}

function changeWeek(event) {
   document.querySelector('.active-week').classList.remove('active-week');
   event.target.classList.add('active-week');
   if (event.target.classList.contains('previous-week')) {
      window.current_schedule.setPreviousWeek();
   } else if (event.target.classList.contains('current-week')) {
      window.current_schedule.setCurrentWeek();
   } else if (event.target.classList.contains('next-week')) {
      window.current_schedule.setNextWeek();
   }
}

function checkDayOpenClose(target) {
   events = $($(target).children()[2]).children();
   if (target.className == 'day') {
      dayOpen(target, events);
   } else {
      dayClose(target, events);
   }
}

function dayOpen(target, events) {
   target.classList.add('open-day');
   $(target).children()[1].classList.remove('hide');
   $(target).children()[2].classList.remove('hide');
   for (let i = 0; i < events.length; i++) {
      events[i].classList.remove('hide');
   }
}

function dayClose(target, events) {
   $(target).children()[1].classList.add('hide');
   $(target).children()[2].classList.add('hide');
   for (let i = 0; i < events.length; i++) {
      if (events[i].classList.contains('event')) {
         events[i].classList.add('hide');
      }
   }
   target.classList.remove('open-day');  
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
   $('.form-submit').click(closeAreas);
   $('.form-submit').click( () => {
      addEvent(day);
   });
}

function closeAreas() {
   document.body.style.overflow = "visible";
   document.querySelector('.background-form').classList.add('hide');
   document.querySelector('.event-day-area').classList.add('hide');
   document.querySelector('.event-change-area').classList.add('hide');
   document.querySelector('.show-event').classList.add('hide');
   document.querySelector('.add-category-area').classList.add('hide');
   document.querySelector('.connection-area').classList.add('hide');
   document.querySelector('.alert-block').classList.add('hide');
}

function addEvent(day) {
   if ($(event.target).parent()[0].classList.contains('event-day-area')) {
      data['event_day'] = day.innerHTML;
      data['event_date'] = $($($(day).parent()).parent()[0]).attr('day-date');
      data['event_name'] = $($(event.target).parent()[0]).children()[1].value;
   }
   data['event-description'] = document.querySelector('.form-description').value;
   document.querySelectorAll('.day').forEach((day_elem) => {
      if ($(day_elem.childNodes[0]).children()[1].innerText.toLowerCase() == data['event_day'].toLowerCase().trim()) {
         if (!day_elem.classList.contains('open-day')) {
            checkDayOpenClose(day_elem);
         }
         sendingEvents(data);
         $(day_elem.childNodes[4]).append(`<div class="event" data-name="${data['event_name']}" data-description="${data['event-description']}">${data['event_name']}</div>`);
         clickOnEvents();
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
   $('.add-category').click(() => {
      createAddEventArea(event_target);
   });
   $('.create-connection').click(() => {
      createConnectionArea(event_target);
   });
}

function createChangeEventArea(event_target) {
   document.querySelector('.show-event').classList.add('hide');
   document.querySelector('.event-change-area').classList.remove('hide');
   data['changed_description'] = $(event_target).attr('data-description');
   $('.change-event').off('click');
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
   closeAreas();
   sendingChangedEvents(data);
}

function createCategory() {
   $('.categories').append(`<div class="menu_class-1 menu_class-1-active btn">
         <input class="menu-filter-name" type="text" placeholder="Название"></input>
         <img class="menu-check-mark" src="../static/img/checkmark.png" alt="" srcset="">
         <div class="menu-cross"></div>
      </div>`);
   $('.menu-check-mark').click(saveCategory);
   $('.menu-cross').click(deleteNewCategory);
}

function saveCategory(event) {
   current_category = $(event.target).parent()[0];
   $(current_category).children()[0].classList.add('hide');
   $(current_category).children()[1].classList.add('hide');
   current_category.classList.remove('menu_class-1-active');
   data['category_name'] = $(current_category).children()[0].value;
   $(current_category).prepend(`<p class="menu_class_text">${data['category_name']}</p>`);
   sendingCategory(data);
}

function createAddEventArea(event_target) {
   document.querySelector('.show-event').classList.add('hide');
   document.querySelector('.add-category-area').classList.remove('hide');
   getCategories($(event_target).attr('data-categories'));
}

function checkActivationCategories(event) {
   if (event.target.className == "menu_class_text") {
      event.target = $(event.target).parent()[0];
   }
   if (event.target.className == "menu_class-1 btn" ) {
      filteringByCategory(event);
      event.target.classList.add('menu_class-1-active');
      other_categories = [];
      document.querySelectorAll('.menu_class-1').forEach((category) => {
         if (category != event.target) {
            category.classList.remove('menu_class-1-active');
         }
      });
   } else {
      event.target.classList.remove('menu_class-1-active');
      document.querySelectorAll('.day').forEach((day) => {
         events = $($(day).children()).children();
         dayClose(day, events);
      });
   }
}

function filteringByCategory(event) {
   current_category_name = $(event.target).children()[0].innerHTML;
   document.querySelectorAll('.day').forEach((day) => {
      events = $($(day).children()[2]).children();
      dayClose(day, events)
   });
   document.querySelectorAll('.event').forEach((event) => {
      category_names = $(event).attr('data-categories').split(' '); 
      category_names.forEach((category) => {
         if (current_category_name == category) {
            $($(event).parent()).parent()[0].classList.add('open-day');
            event.classList.remove('hide');
            $(event).parent()[0].classList.remove('hide')
            $($($(event).parent()).parent()[0]).children()[1].classList.remove('hide');
         }
      });
   });
}

function deleteNewCategory(event) {
   $($(event.target).parent()).remove();
}

function createCode() {
   code = []
   for (let i = 0; i < 6; i++) {
      alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-";
      randomIndex = Math.floor(Math.random() * alphabet.length);
      randomLatter = alphabet[randomIndex];
      code.push(randomLatter)
   }
   code = code.join('');
   document.querySelector('.code').innerHTML = code;
   sendingCode(code);
}

function createConnectionArea(event_target) {
   document.querySelector('.show-event').classList.add('hide');
   document.querySelector('.connection-area').classList.remove('hide');
   $('.close-form-connection-area').click(closeAreas);
   $('.send-code').click(() => {
      sendingCodeToEvent($(event_target).attr('data-id'), document.querySelector('.form-input-code').value)
   });
}



/*
========================================================================================================
РЕНДЕРИНГ ДАННЫХ С СЕРВЕРА НА СТРАНИЧКЕ
========================================================================================================
*/
function renderEvents(response) {
   response.forEach((event) => {
      categories = []
      if (event[7]) {
         event[7].forEach((category) => {
            categories.push(category[3])
         })
      }
      document.querySelectorAll('.day').forEach((day) => {
         if ($(day).attr('day-date') == event[3]) {
            $(day.childNodes[4]).append(`<div class="event hide" data-id="${event[0]}" data-name="${event[1]}" data-description="${event[5]}" data-categories="${categories.join(' ')}">${event[1]}</div>`);
         };
      });
   });
}

function renderCategories(response, param) {
   counter = 1
   categories = $('.categories');
   categories_list = $('.categories-list');
   categories_list.html('');
   if (response.length != 0) {
      response.forEach((category) => {
         if (param == 'xb6q~{') {
            categories.append(`<div class="menu_class-1 btn" data-category-id="${category[0]}">
               <p class="menu_class_text">${category[2]}</p>
               <div class="menu-cross"></div>
            </div>`)
         } else {
            categories_list.append(`<div class="category-wrap" category-id="${category[0]}">
            <input type="checkbox" name="" id="checkbox-category-${counter}" class="checkbox-category-input">
            <label for="checkbox-category-${counter}" class="checkbox-category-label">${category[2]}</label>
            </div>`);
            if (param) {
               param.split(' ').forEach((event_category) => {
                  console.log(event_category)
                  if (event_category == category[2]) {
                     document.querySelectorAll('.checkbox-category-input')[counter-1].checked = true;
                  }
               });
            }
         }
         counter += 1
      });
   } else {
      if (!document.querySelector('.menu-title-no-categories')) {
         categories.append(`<h1 class="menu-title-no-categories">Категорий пока нет</h1>`);
      }
      if (!document.querySelector('.menu-event-no-categories')) {
         categories_list.append(`<h1 class="menu-event-no-categories">Категорий пока нет</h1>`);
      }
   }
   $('.menu_class-1').off('click');
   $('.menu_class-1').click(checkActivationCategories);
   $('.menu-cross').click(deleteCategory);
}



/*
========================================================================================================
РАБОТА С СЕРВЕРОМ
========================================================================================================
*/
function sendingEvents(data) {
   $.post("/", data, success = function(response) {});
}

function deleteCategory(event) {
   category = $(event.target).parent();
   $(category).remove();
   $.post("/delete_category", {"category_id" : $(category).attr('data-category-id')}, success = function(response) {});
}

function sendingCategory(data) {
   console.log(data['category_name']);
   $.post("/create_category", data, success = function(response) {});
}

function deleteEvent(data) {
   $.post("/delete_event", data, success = function(response) {
      document.querySelector('.background-form').classList.add('hide');
      document.querySelector('.show-event').classList.add('hide');
      ev = document.querySelector(`div[data-id="${response}"]`);
      $(ev).remove();
   });
}

function sendingChangedEvents(data) {
   console.log(data['changed_name'])
   $.post("/changing_events", data, success = function(response) {});
}

function getData() {
   $.post("/get_data", 'hello', success = function(response) {
      window.current_schedule = new schedule();
      renderEvents(JSON.parse(response));
      window.current_schedule.events = JSON.parse(response);
      window.current_schedule.setCurrentDay();
      clickOnEvents();
	});
   main();
   getCategories('xb6q~{');
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
   $.post("/create_categories_and_events", data, success = function(response) {});
   closeAreas();
}

function sendingCode(code) {
   $.post("/save_code", {'code' : code}, success = function(response) {});
}

function sendingCodeToEvent(event_id, code) {
   $.post("/save_code_to_event", {'code' : code, "event_id" : event_id}, success = function(response) {
      if (response == 'Данного кода не существует') {
         document.querySelector('.alert-block').classList.remove('hide');
      } else {
         closeAreas;
      }
   });
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
         checkDayOpenClose(day);
      });
   });
   $('.create-event').click(createEventArea);
   $('.create-event-day').click(() => {
      day = $($($(event.target).parent()[0]).children()[0]).children()[1];
      createEventArea(event, day);
   });
   $('.form-close').click(closeAreas);
   $('.exit').click(signOut);
   $('.menu_add_class').click(createCategory);
   $('.sending-added-categories').click(sendingAddedCategories);
   $('.create-code').click(createCode);
   $($($('.change-week')).children()).click(changeWeek);
}

document.addEventListener('DOMContentLoaded', getData);