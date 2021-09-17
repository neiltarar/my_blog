const modal = document.getElementById('id01');
const signupWindow = document.getElementById('signup-window');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const editButton =  document.getElementById('edit-button');
const editBox = document.getElementById('edit-box');
const closeButton = document.getElementById('close-window');
const editCloseButton = document.getElementById('signup-close-window');
const signupCloseButton = document.getElementById('signup-close-window');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');


editCloseButton.addEventListener('click' , (event) =>{
    editBox.classList.remove('show')
});

function showEditBox() {
    console.log('pressed')
    editBox.classList.add('show')
};

loginButton.addEventListener('click' , (event) =>{
    modal.classList.add('show')
});

closeButton.addEventListener('click' , (event) => {
        modal.classList.remove('show')
});

signupButton.addEventListener('click' , (event) =>{
    signupWindow.classList.add('show')
    modal.classList.remove('show')
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