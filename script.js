

document.addEventListener('DOMContentLoaded', function () {
    let currentIndex = 0;
    const items = document.querySelectorAll('.work-item');
    
    // Hide all items initially
    items.forEach(item => item.style.display = 'none');
    
    // Show the first item
    if(items.length > 0) {
        items[0].style.display = 'block';
    }

    function showNextItem() {
        // Hide the current item
        items[currentIndex].style.display = 'none';
        
        // Calculate the index of the next item
        currentIndex = (currentIndex + 1) % items.length;
        
        // Show the next item
        items[currentIndex].style.display = 'block';
    }

    // Change item every 3 seconds
    setInterval(showNextItem, 3000);
});
