function addToCart(name, img, price) {
  const shoppingList = document.querySelector('.bundle');
  if (!shoppingList) {
      console.error('Shopping list container not found');
      return;
  }
  // Create a new list item for the selected product
  const listItem = document.createElement('li');
  // Create elements for image,name, price.
  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;

  const priceSpan = document.createElement('span');
  priceSpan.textContent = ` ${price}`;

  const imageSpan = document.createElement('img');
  imageSpan.src = ` ${img}`;

  imageSpan.width = 70;  // Adjust the width to 200px
  imageSpan.height = 70; // Adjust the height to 150px
  // Append all elements to the list item
  listItem.appendChild(imageSpan);
  listItem.appendChild(nameSpan);
  listItem.appendChild(priceSpan);

  // Append the new item to the shopping list
  shoppingList.appendChild(listItem);
}
