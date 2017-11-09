# aeris-commons-components-vjs

> Aeris commons components. 

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

<isgi-form info="poleterre" url="http://service.xyz.fr" lang="en"></isgi-form>
<script src="https://rawgit.com/terresolide/isgi-component-vjs/master/dist0/isgi-component-vjs_0.0.2.js"></script> 

```

---

## API



### Props

#### :lang
 the language
 * fr or en
 * default : fr
 
#### :info
 informtation about user
 
#### :url
 the api service url