function reg() {
   login = document.querySelector('#user_name').value;
   email = document.querySelector('#user_email').value;
   password = document.querySelector('#user_password').value;
   if (password && login && email) {
      $.post("/reg", {'user_name' : login, 'user_email' : email, 'user_password' : password}, success = function(response) {
         if (response == 'Такой пользователь уже существует') {
            document.querySelector('.alert').innerHTML = "Такой пользователь уже существует";
            document.querySelector('.alert-block').classList.remove('hide');
            document.querySelector('.login-block').style.paddingTop = '6%';
         } else {
            document.location.href="/";
         }
      });
   } else {
      document.querySelector('.alert').innerHTML = "Введите все данные"; 
      document.querySelector('.alert-block').classList.remove('hide');
      document.querySelector('.login-block').style.paddingTop = '6%';
   }
}

$('.reg-submit').click(() => {
   reg();
});

