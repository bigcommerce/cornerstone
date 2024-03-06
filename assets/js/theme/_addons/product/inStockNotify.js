export default class inStockNotifyForm {
  constructor(modal) {
    this.productSku = '';
    this.element = modal;
    this.emailField = modal.querySelector("#inStockNotifyEmailAddress-custom");
    this.submitButtonContainer = modal.querySelector("#inStockNotifyButton-custom");
    this.modalCloseButton = modal.querySelector(".modal-close");
    this.emailErrorMessage = modal.querySelector("#inStockNotifyInvalidEmail-custom");
    this.formErrorMessage = modal.querySelector("#inStockNotifyError-custom");
    this.successMessage = modal.querySelector("#inStockNotifyComplete-custom");
    this.submitHandler = this.submitHandler.bind(this);
    this.loadForm = this.loadForm.bind(this);
    this.clearForm = this.clearForm.bind(this);

    this.yearSelect = document.querySelector('#year');
    this.opt1Select = document.querySelector('#option-one');
    this.opt2Select = document.querySelector('#option-two');
    
    this.vehicleIndex = '';
    this.endIndex = '';
    this.registrationId = '';

    this.submitButton = document.createElement('input');
    this.submitButton.classList.add('button', 'button--primary');
    this.submitButton.id = 'inStockNotifyClick-custom';
    this.submitButton.name = 'inStockNotifyClick-custom';
    this.submitButton.style.marginTop = '1rem';
    this.submitButton.type = 'button';
    this.submitButton.value = 'Notify Me';


    $("#stock-notification").on("open.fndtn.reveal", () => this.loadForm());
    $("#stock-notification").on("close.fndtn.reveal", () => this.clearForm());
  }

  validateEmail(email) {
    console.log('validate email');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  sendForm(product_id) {
    console.log('send form for: ', product_id);
    document.querySelector("#inStockNotifyError-custom").style.display = "none";
    document.querySelector("#inStockNotifyInvalidEmail-custom").style.display = "none";
    const email = this.emailField.value;
    if (this.validateEmail(email)) {
      console.log("send form for the product: ", product_id);
      console.log("registered to: ", email);
      const url =
        "https://www.instocknotify.net/api/bigcommerce/headless/create";
      const storeId = "bce62a20521f465e8b12bbd27f747ce6";
      const siteId = 1000;
      const postData = {
        storeId: storeId,
        siteId: siteId,
        productId: product_id,
        variantId: null,
        email: email,
        ParentProductUrl: parent_product_url,
      };
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data == "success") {
            document.querySelector(
              "#inStockNotifyComplete-custom"
            ).style.display = "";
            this.submitButton.disabled = true;
          } else {
            document.querySelector("#inStockNotifyError-custom").style.display =
              "";
          }
        })
        .catch((error) => console.error(error));
    } else {
      console.log("invalid email");
      document.querySelector(
        "#inStockNotifyInvalidEmail-custom"
      ).style.display = "";
    }
  }

  submitHandler() {
    this.sendForm(this.registrationId);
  }

  loadForm() {
    console.log('load form');
    this.submitButtonContainer.appendChild(this.submitButton);

    if (this.opt2Select.options.length > 0) {
      this.endIndex = this.opt2Select.value;
      console.log('opt 2 is end: ', this.endIndex);
    } else if (this.opt1Select.options.length > 0) {
      this.endIndex = this.opt1Select.value;
      console.log('selected: ', this.opt1Select.value);
      console.log('opt 1 is end: ', this.endIndex);
    } else {
      this.endIndex = option_data[this.yearSelect.value][0].index;
      console.log('year is end: ', this.endIndex);
    }

    this.registrationId = key_dict[this.endIndex].bc_id;
    this.vehicleIndex = document.querySelector('#year').value;
    document.querySelector(`#${this.submitButton.id}`).addEventListener('click', this.submitHandler);
  }

  clearForm() {
    console.log("clear");
    this.submitButtonContainer.innerHTML = '';
    this.emailErrorMessage.style.display = "none";
    this.emailField.value = "";
    this.successMessage.style.display = "none";
    this.formErrorMessage.style.display = "none";
  }
}
