# isgi-components-vjs

> isgi-component. Request to ISGI and display charts of geomagnetic index

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Exemple

```
<!-- used with aeris theme to define color -->
<aeris-theme id="theme2" active="true" primary="#F1684E" emphasis="#39B062"></aeris-theme>

<isgi-form lang="en"></isgi-form>
<script src="https://rawgit.com/terresolide/isgi-component-vjs/master/dist0/isgi-component-vjs.js"></script> 

```

---

## API



### Props

#### :lang
 > the language
 * fr or en
 * default : fr
 

 
#### :url
 > the api service url
 * @todo actually direct in script