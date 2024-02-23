export default class inStockNotifyForm {
  constructor(modal, product_id) {
    console.log('construct inStockNotify');
    this.element = modal;
    this.product_id = product_id;
    this.emailField = modal.querySelector("#inStockNotifyEmailAddress-custom");
    this.submitButton = modal.querySelector("#inStockNotifyClick-custom");
    this.modalCloseButton = modal.querySelector(".modal-close");
    this.emailErrorMessage = modal.querySelector("#inStockNotifyInvalidEmail-custom");
    this.formErrorMessage = modal.querySelector("#inStockNotifyError-custom");
    this.successMessage = modal.querySelector("#inStockNotifyComplete-custom");
    this.submitHandler = this.submitHandler.bind(this);
    this.clearForm = this.clearForm.bind(this);

    
    if (!this.initialized) {
      console.log('adding submit listener');
      this.submitButton.addEventListener("click", this.submitHandler);
      $("#stock-notification").on("close.fndtn.reveal", () => this.clearForm());
      this.initialized = true;
      console.log('this.initialized: ', this.initialized);
    }

  }

  validateEmail(email) {
    console.log('validate email');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  sendForm(product_id) {
    console.log('send form');
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
    this.sendForm(product_id);
  }

  clearForm() {
    console.log("clear");
    this.emailErrorMessage.style.display = "none";
    this.emailField.value = "";
    this.successMessage.style.display = "none";
    this.formErrorMessage.style.display = "none";
  }
}
