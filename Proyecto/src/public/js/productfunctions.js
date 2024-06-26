function decreaseQuantity(button) {
    let input = button.parentNode.querySelector('input[type=number]');
    let currentValue = parseInt(input.value);
    if (!isNaN(currentValue) && currentValue > 1) {
        input.value = currentValue - 1;
    }
}

function increaseQuantity(button) {
    let input = button.parentNode.querySelector('input[type=number]');
    let currentValue = parseInt(input.value);
    if (!isNaN(currentValue)) {
        input.value = currentValue + 1;
    }
}