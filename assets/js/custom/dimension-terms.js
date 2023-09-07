// Database of terminology names for all products
// Individual products will pull from the following tree, based on if the dimension is specified:
// their own custom field, then tertiary category, secondary category, main category, defaults (width/height/depth)

// set the term to "null" to hide the dimension all together - mostly just used for diamter

export default {
  'Cabinet Hardware': {
      x: 'Height',
      y: 'Width',
      z: 'Projection',
  },
  'Cabinet Hardware/Cabinet Knobs': {
      x: 'Length',
  },
  'Cabinet Hardware/Cabinet Knobs/Round': {
      x: 'Diameter',
      y: null,
  },
  'Cabinet Hardware/Cabinet Knobs/Oval': {
      x: 'Diameter',
      y: null,
  },
  'Cabinet Hardware/Cabinet Knobs/Sphere': {
      x: 'Diameter',
      y: null,
  },
  'Cabinet Hardware/Cabinet Knobs/Cone': {
      x: 'Diameter',
      y: null,
  },
  'Cabinet Hardware/Cabinet Knobs/Push': {
      x: 'Diameter',
      y: null,
  },
  'Cabinet Hardware/Cabinet Pulls': {
      x: 'Width',
      y: 'Overall Length',
  },
  'Cabinet Hardware/Appliance Pulls': {
      x: 'Overall Length',
  },
  'Cabinet Hardware/Cabinet Hinges': {
      z: 'Thickness',
  },
  'Cabinet Hardware/Backplates': {
      z: 'Thickness',
  },
  'Cabinet Hardware/Backplates/Rosette': {
      x: 'Diameter',
      y: null,
      z: 'Thickness',
  },
  'Cabinet Hardware/Catches': {
      z: 'Depth',
  },

  'Door Hardware': {
      x: 'Height',
      y: 'Width',
      z: 'Depth',
  },
  'Door Hardware/Door Plates': {
      x: 'Length',
      z: 'Thickness',
  },
  'Door Hardware/Door Plates/Rose': {
      x: 'Diameter',
      y: null,
  },
  'Door Hardware/Miscellaneous Door Hardware': {
      z: 'Projection',
  },
  'Door Hardware/Door Hinge': {
      z: 'Thickness',
  },
  'Door Hardware/Door Latch': {
      x: 'Length',
  },

  'Bath Accessories': {
      x: 'Height',
      y: 'Width',
      z: 'Depth',
  },
  'Bath Accessories/Towel Holders': {
      x: 'Overall Length',
      z: 'Projection',
  },
  'Bath Accessories/Towel Holders/Towel Rings': {
      x: 'Height',
      y: 'Diameter',
  },
  'Bath Accessories/Towel Holders/Towel Basket': {
      x: 'Height',
  },
  'Bath Accessories/Shelves': {
      x: 'Length',
      z: null,
  },
  'Bath Accessories/Grab Bars': {
      x: 'Length',
      z: 'Projection',
  },
  'Bath Accessories/Decorative Hooks': {
      z: 'Projection',
  },
  'Bath Accessories/Miscellaneous': {
      z: 'Projection',
  },

  'Home Accents': {
      x: 'Height',
      y: 'Width',
      z: 'Depth',
  },
  'Home Accents/Moulding/Trim Moulding': {
      x: 'Length',
  },
  'Home Accents/Moulding/Crown Moulding': {
      x: 'Length',
  },
  'Home Accents/Moulding/Rope Moulding': {
      x: 'Length',
  },
  'Home Accents/Moulding/Dentil Moulding': {
      x: 'Length',
  },
  'Home Accents/Moulding/Embossed Moulding': {
      x: 'Length',
  },
  'Home Accents/Moulding/Base & Rail Moulding': {
      x: 'Length',
  },
  'Home Accents/Moulding/Column Moulding': {
      x: 'Length',
  },
  'Home Accents/Switch Plates': {
      z: null,
  },
  'Home Accents/Floor Registers': {
      x: 'Length',
  },
  'Home Accents/Kitchen/Kitchen Islands': {
      z: 'Height',
      x: 'Length',
  },
  'Home Accents/Closet': {
      x: 'Length',
  },
  'Home Accents/Wire Mesh': {
      x: 'Length',
  },
  Functional: {
      x: 'Length',
      y: 'Width',
      z: 'Depth',
  },
  'Functional/Cabinet Construction': {
      z: 'Thickness',
  },
  'Functional/Cabinet Construction/Drawer Boxes': {
      z: null,
  },
  'Functional/Cabinet Construction/Drawer Slides': {
      z: null,
  },
};
