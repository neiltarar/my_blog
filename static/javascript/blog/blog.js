const modal = document.getElementById('id01');
const signupWindow = document.getElementById('signup-window');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const closeButton = document.getElementById('close-window');
const signupCloseButton = document.getElementById('signup-close-window')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirm-password')

loginButton.addEventListener('click' , (event) =>{
    modal.classList.add('show')
})

closeButton.addEventListener('click' , (event) => {
        modal.classList.remove('show')
});

signupButton.addEventListener('click' , (event) =>{
    signupWindow.classList.add('show')
});

signupCloseButton.addEventListener('click' , (event)=>{
    signupWindow.classList.remove('show')
});

function validatePassword(){
    if(password.value !== confirmPassword.value){
        confirmPassword.setCustomValidity("Passwords Don't Match");
  } else {
    confirmPassword.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;