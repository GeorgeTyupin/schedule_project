var days = new Vue({
   el: '#prev',
   data: {
     open_day : {
        day : 'Понедельник',
        tasks : [],
        id: 1
     },
     close_days : [
      { //1
         day : 'Вторник',
         tasks : [],
         id: 2
      },
      { //2
         day : 'Среда',
         tasks : [],
         id: 3
      },
      { //3
         day : 'Четверг',
         tasks : [],
         id: 4
      },
      { //4
         day : 'Пятница',
         tasks : [],
         id: 5
      },
      { //5
         day : 'Суббота',
         tasks : [],
         id: 6
      },
      { //6
         day : 'Воскресенье',
         tasks : [],
         id: 7
      }
     ]
   }
 })

function changeOpenCloseDay(event) {
   name_open_day = event.target.querySelector('h1').innerText
   for (var i = 0; i < days.close_days.length; i++) {
      if (days.close_days[i].day == name_open_day) { 
         break;
      }
   }
   let temp = days.open_day
   days.open_day = days.close_days[i]
   days.close_days[i] = temp
   sortDays()
}

function sortDays() {
   check = true
   while (check == true) {
      check = false
      for (i = 0; i < days.close_days.length - 1; i++) {
         if (days.close_days[i].id > days.close_days[i+1].id) {
            temp = days.close_days[i]
            days.close_days[i] = days.close_days[i+1]
            days.close_days[i+1] = temp
            check = true
         }
         console.log(days.close_days)
      }
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
      if (day.childNodes[0].innerText == event_day) {
         $(day.childNodes[2]).append(`<div class="event">${event_name}</div>`);
      };
   });
 }

function main() {
   $('.day').click(changeOpenCloseDay);
   $('.create-event').click(createEventArea);
   $('.form-close').click(closeEventArea);
   $('.form-submit').click(closeEventArea);
   $('.form-submit').click(addEvent);
}

document.addEventListener('DOMContentLoaded', main);