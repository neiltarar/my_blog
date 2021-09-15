console.log('hello')

// Get the modal
const modal = document.getElementById('id01');
const signupWindow = document.getElementById('signup-window');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const closeButton = document.getElementById('close-window');
const signupCloseButton = document.getElementById('signup-close-window')


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
