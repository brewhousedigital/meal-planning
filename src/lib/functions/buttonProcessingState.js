export const buttonProcessingState = (element, status = false) => {
    let submitBtn = document.querySelector(element);
    submitBtn.disabled = true;
    submitBtn.style.width = submitBtn.offsetWidth + "px";

    if(status) {
        submitBtn.innerHTML = `
            <i class="bi bi-check-lg"></i>
        `;
    } else {
        submitBtn.innerHTML = `
            <span class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </span>
        `;
    }

}

export const buttonProcessingStateEnable = (element, text) => {
    let submitBtn = document.querySelector(element);
    if(submitBtn !== null) {
        submitBtn.disabled = false;
        submitBtn.style.width = "";
        submitBtn.textContent = text;
    }
}