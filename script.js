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
  const dragAreaInfoTip = document.querySelector('.drag-area__info-tip');
  const dragAreaErrorMessage = document.querySelector('.drag-area__error > .error__text');

  // Initiliase drop area
  if (!dragInput.files.length) {
    dragAreaThumbnail.style.backgroundSize = 'auto';
    dragAreaThumbnail.style.backgroundImage = 'url(../assets/images/icon-upload.svg)';
    dragAreaPrompt.textContent = 'Drag and drop or click to upload';
    dragAreaOptionBtns.classList.add('hidden');
    if (!dragAreaErrorMessage.textContent) {
      dragAreaInfoTip.classList.remove('hidden');
    }
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
validateForm('#registrationForm');

function validateForm(formSelector) {
  const formElement = document.querySelector(formSelector);

  const validationOptions = [
    {
      attribute: 'data-file-size',
      isValid: (input) =>
        input.files.length > 0 ? input.files[0].size <= Number(input.dataset.fileSize) : false,
      errorMessage: (input) => {
        if (input.files.length) {
          const maxFileSize = input.dataset.fileSize / 1000;
          return `File too large. Please upload a photo under ${maxFileSize}KB.`;
        }
      },
    },
    {
      attribute: 'required',
      isValid: (input) => input.value.trim() !== '',
      errorMessage: (input, label) =>
        input.type === 'file'
          ? 'Please upload your photo, as a JPG or PNG under 500KB.'
          : `Please enter a valid ${label.textContent.toLowerCase()}.`,
    },
    {
      attribute: 'pattern',
      isValid: (input) => {
        const regex = new RegExp(input.pattern);
        return regex.test(input.value);
      },
      errorMessage: (input, label) => `Please enter a valid ${label.textContent.toLowerCase()}.`,
    },
  ];

  function validateSingleFormGroup(formGroup) {
    const input = formGroup.querySelector('input');
    const label = formGroup.querySelector('label');
    const errorText = formGroup.querySelector('.error__text');
    const infoTip = formGroup.querySelector('.info-tip') || false;

    let formGroupError = false;

    for (const option of validationOptions) {
      // If errors, display error state
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        errorText.textContent = option.errorMessage(input, label);
        input.classList.add('error__active');
        if (infoTip) infoTip.classList.add('hidden');
        formGroupError = true;
      }
    }

    // If no errors, remove error state
    if (!formGroupError) {
      errorText.textContent = '';
      input.classList.remove('error__active');
    }

    // Function returns true if no errors, false if errors
    return !formGroupError;
  }

  // Function to validate all form groups
  function validateAllFormGroups(formToValidate) {
    const formGroups = Array.from(formElement.querySelectorAll('.form-group'));

    // Returns true if no errors in form, false if errors
    return !formGroups.map((formGroup) => validateSingleFormGroup(formGroup)).includes(false);
  }

  // Remove HTML validation, execute custom validation when form is submitted
  formElement.setAttribute('novalidate', '');
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateAllFormGroups(formElement)) {
      console.log('Form valid');
    } else {
      console.log('Form NOT valid');
    }
  });
}
