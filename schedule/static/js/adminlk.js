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
   if (target.className == 'day') {
      target.classList.add('open-day');
      for (let i = 1; i < $(target).children().length; i++) {
         $(target).children()[i].classList.remove('hide');
      }
   } else {
      for (let i = 1; i < $(target).children().length; i++) {
         $(target).children()[i].classList.add('hide');
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
   event_name = document.querySelector('.form-input-name').value;
   event_day = document.querySelector('.form-input-day').value;
   document.querySelectorAll('.day').forEach((day) => {
      if (day.childNodes[0].innerText.toLowerCase() == event_day.toLowerCase()) {
         if (day.className == 'day') {
            dayOpenClose(day);
         }
         $(day.childNodes[2]).append(`<div class="event">${event_name}</div>`);
      };
   });
 }

function main() {
   document.querySelectorAll('.day').forEach((day) => {
      day.addEventListener('click', () => {
         dayOpenClose(day);
      });
   });
   $('.create-event').click(createEventArea);
   $('.form-close').click(closeEventArea);
   $('.form-submit').click(closeEventArea);
   $('.form-submit').click(addEvent);
}

document.addEventListener('DOMContentLoaded', main);