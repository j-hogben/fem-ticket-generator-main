// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ DROP AREA ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

const dragAreaInput = document.querySelector('.drag-area__input');
const dragAreaElement = dragAreaInput.closest('.drag-area');

// Drag area interaction event listeners
dragAreaElement.addEventListener('click', (e) => {
  if (dragAreaInput.files.length < 1) {
    dragAreaInput.click();
  }
});
//
dragAreaInput.addEventListener('change', (e) => {
  if (dragAreaInput.files.length) {
    updateDropArea(dragAreaInput, dragAreaInput.files[0]);
  }
});
//
dragAreaElement.addEventListener('dragover', (e) => {
  e.preventDefault();
  dragAreaElement.classList.add('drag-area__over');
});
// ~ ~ ~ ~ ~
['dragend', 'dragleave'].forEach((dragType) => {
  dragAreaElement.addEventListener(dragType, (e) => {
    dragAreaElement.classList.remove('drag-area__over');
  });
});
// ~ ~ ~ ~ ~
dragAreaElement.addEventListener('drop', (e) => {
  e.preventDefault();
  // If there are files when 'dropped', they are assigned to the files property on the dragAreaInput
  if (e.dataTransfer.files.length) {
    dragAreaInput.files = e.dataTransfer.files;
    updateDropArea(dragAreaInput, dragAreaInput.files[0]);
  }
  dragAreaElement.classList.remove('drag-area__over');
});

// Executions
document.addEventListener('DOMContentLoaded', updateDropArea(dragAreaInput));

// Update drop area function
function updateDropArea(dragInput, avatarImage) {
  const dragAreaThumbnail = document.querySelector('.drag-area__thumbnail');
  const dragAreaPrompt = document.querySelector('.drag-area__prompt');
  const dragAreaOptionBtns = document.querySelector('.drag-area__option-btns');

  // Initiliase drop area
  if (!dragInput.files.length) {
    dragAreaThumbnail.style.backgroundSize = 'auto';
    dragAreaThumbnail.style.backgroundImage = 'url(../assets/images/icon-upload.svg)';
    dragAreaPrompt.textContent = 'Drag and drop or click to upload';
    dragAreaOptionBtns.classList.add('hidden');
    return;
  }

  // Remove prompt
  if (dragAreaPrompt.textContent) {
    dragAreaPrompt.textContent = '';
  }

  // Update thumbnail
  if (avatarImage.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.readAsDataURL(avatarImage);
    reader.onload = () => {
      dragAreaThumbnail.style.backgroundImage = `url(${reader.result})`;
      dragAreaThumbnail.style.backgroundSize = 'cover';
    };
  }

  // Display drag area option buttons
  dragAreaOptionBtns.classList.remove('hidden');
}

// Change image button
function changeImage() {
  dragAreaInput.click();
}

// Remove image button
function removeImage() {
  setTimeout(() => {
    dragAreaInput.value = '';
    updateDropArea(dragAreaInput);
  }, 0);
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ FORM VALIDATION ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
