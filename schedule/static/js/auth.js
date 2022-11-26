function auth() {
   login = document.querySelector('#user_name').value;
   password = document.querySelector('#user_password').value;
   if (password && login) {
      $.post("/auth", {'user_name' : login, 'user_password' : password}, success = function(response) {
         if (response == 'Неправильный логин или пароль') {
            document.querySelector('.alert').innerHTML = "Неправильный логин или пароль"; 
            document.querySelector('.login-block').style.paddingTop = '3%';
            document.querySelector('.alert-block').classList.remove('hide');
         } else {
            document.location.href="/";
         }
      });
   } else {
      console.log(2)
      document.querySelector('.alert').innerHTML = "Введите все данные"; 
      document.querySelector('.alert-block').classList.remove('hide');
      document.querySelector('.login-block').style.paddingTop = '3%';
   }
}

$('.auth-submit').click(() => {
   auth();
});
