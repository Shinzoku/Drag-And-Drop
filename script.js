document.addEventListener('DOMContentLoaded', function () {
    // Get necessary elements from the DOM
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');

    // Add event listeners for drag and drop functionality
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // Initialize Sortable for the preview container
    new Sortable(previewContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost'
    });
    
    // Function to handle dragover event
    function handleDragOver(event) {
        event.preventDefault();
        dropArea.classList.add('drag-over');
    }

    // Function to handle dragleave event
    function handleDragLeave(event) {
        event.preventDefault();
        dropArea.classList.remove('drag-over');
    }

    // Function to handle drop event
    function handleDrop(event) {
        event.preventDefault();
        dropArea.classList.remove('drag-over');
        const files = event.dataTransfer.files;
        handleFiles(files);
    }

    // Function to handle file selection using input
    function handleFileSelect() {
        const files = fileInput.files;
        handleFiles(files);
    }

    // Function to handle selected files
    function handleFiles(files) {
        for (const file of files) {
            if (isValidFileType(file)) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
                createImagePreview(file, imageUrl);
            };
            reader.readAsDataURL(file);
            } else {
            alert('Invalid file type! Please select an image.');
            }
        }
    }

    // Function to check if the file type is valid
    function isValidFileType(file) {
        // Define allowed MIME types for images
        const allowedTypes = ['image/jpeg', 'image/png'];
    
        // Check if the file type is in the allowedTypes array
        return allowedTypes.includes(file.type);
        }
    
        // Function to create image preview and delete button
        function createImagePreview(file, imageUrl) {
        const previewImage = document.createElement('div');
        previewImage.classList.add('preview-image');
        previewImage.innerHTML = `
            <img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; max-height: 100%;">
            <p>${file.name}</p>
            <div style="margin: 4px; color: red;" class="delete-button" onclick="deleteImage(this)">X</div>
        `;
        previewContainer.appendChild(previewImage);
    }

    // Function to delete an image preview
    window.deleteImage = function (deleteButton) {
        const previewImage = deleteButton.parentElement;
        previewContainer.removeChild(previewImage);
    };
});
