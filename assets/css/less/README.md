# Blueprint with LESS


## About

LESS is a dynamic stylesheet language, which extends CSS.

For more information about less, checkout  http://lesscss.org


# Installing LESS

You'll need to have NodeJS and LESS installed to compile your theme's CSS.

Installation steps can be found at: http://lesscss.org/#usage



# Compile your CSS

From within the less directory, run:

```bash
lessc theme.less > ../theme.css
```



# Compile & minify your CSS

From within the less directory, run:

```bash
lessc -x theme.less > ../theme.min.css
```
