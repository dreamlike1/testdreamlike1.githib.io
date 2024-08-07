document.addEventListener('DOMContentLoaded', () => {
    const searchSelects = document.querySelectorAll('.searchSelect3');

    searchSelects.forEach(wrapper => {
        const select = wrapper.querySelector('.searchSelect3_Input');
        const caret = wrapper.querySelector('.searchSelect3_Caret_Down');
        const dropdownList = document.createElement('ul');
        
        dropdownList.className = 'searchSelect3_List';
        dropdownList.style.display = 'none'; // Initially hidden

        // Populate the dropdown list
        Array.from(select.options).forEach(option => {
            if (option.value) {
                const listItem = document.createElement('li');
                listItem.textContent = option.text;
                listItem.dataset.value = option.value;

                listItem.addEventListener('click', () => {
                    select.value = option.value;
                    select.dispatchEvent(new Event('change'));
                    caret.textContent = option.text; // Update caret text
                    dropdownList.style.display = 'none'; // Hide dropdown after selection
                });

                dropdownList.appendChild(listItem);
            }
        });

        wrapper.appendChild(dropdownList);

        // Toggle dropdown list visibility on caret click
        caret.addEventListener('click', () => {
            const isVisible = dropdownList.style.display === 'block';
            dropdownList.style.display = isVisible ? 'none' : 'block';
        });

        // Hide dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!wrapper.contains(event.target)) {
                dropdownList.style.display = 'none';
            }
        });
    });
});
