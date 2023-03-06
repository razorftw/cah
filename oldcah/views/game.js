// Get the modal
const modal = document.getElementById('error-modal');
const closeButton = document.getElementsByClassName('close-button')[0];
function showError() {
    modal.style.display = 'block';
}
closeButton.onclick = function() {
    modal.style.display = 'none';
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
function handleError(error) {
    if (typeof error === 'string' && error.length > 0) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.innerText = error;
        showError();
    }
}