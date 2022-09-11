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

function createEventArea() {
   document.body.style.overflow = "hidden";
   document.querySelector('.background-form').classList.remove('hide');
}

function closeEventArea() {
   document.body.style.overflow = "visible";
   document.querySelector('.background-form').classList.add('hide');
}

function addEvent() {
   data['event_name'] = document.querySelector('.form-input-name').value;
   data['event_day'] = document.querySelector('.form-input-day').value;
   data['event-description'] = document.querySelector('.form-description').value;
   document.querySelectorAll('.day').forEach((day) => {
     if (day.childNodes[0].innerText.toLowerCase() == data['event_day'].toLowerCase()) {
        if (day.className == 'day') {
           dayOpenClose(day);
           sendingEvents(data);
        }
        $(day.childNodes[2]).append(`<div class="event">${data['event_name']}</div>`);
     };
  });
}


function changeEvent(event) {
   console.log("event")
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
            console.log(day.childNodes)
            $(day.childNodes[4]).append(`<div class="event hide">${event[1]}</div>`);
         };
      });
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

function getData() {
   $.post("/getdata", 'hello', success = function(response) {
      renderEvents(JSON.parse(response));
	});
}

function signOut() {
   $.post("/exit", data, success = function(response) {
      document.location.href = "/auth"
   });
}



/*
========================================================================================================
ВЫЗОВ ФУНКЦИЙ
========================================================================================================
*/
function main() {
   document.querySelectorAll('.day').forEach((day) => {
      day.addEventListener('click', () => {
         dayOpenClose(day);
      });
   });
   console.log(document.getElementsByClassName('event'))
   $('.event').click(function(event) {
      console.log(event);
   });
   $('.create-event').click(createEventArea);
   $('.form-close').click(closeEventArea);
   $('.form-submit').click(closeEventArea);
   $('.form-submit').click(addEvent);
   $('.exit').click(signOut);
   getData();
}

document.addEventListener('DOMContentLoaded', main);