# 💲DollarDOM

> 👬 A Friendly wrapper for your favourite DOM Apis ✨ in **800 bytes** ( minified + gzipped ) 🙌

<hr>

[![Build Status](https://travis-ci.org/namshi/dollar-dom.svg?branch=master)](https://travis-ci.org/namshi/dollar-dom)
[![Open Source Namshi](https://img.shields.io/badge/open--source-Namshi-blue.svg)](https://github.com/namshi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<hr>

## Why

DollarDOM is not a polyfill or a new dom library. It's a simple wrapper for these mostly used DOM APIs:
  - createElement
  - querySelector 
  - querySelectorAll
  - addEventListener

DollarDOM abstracts the above methods and provides a `$` object ( jQuery style ). It also has an `on` method which can be chained with the `$` selector function. Here is a simple example:

```js
var collection = document.querySelectorAll('.some-class');
collection = [].slice.call(collection) // required for older browsers.
collection.forEach( elem => {
  elem.addEventListener('click', function(){
    console.log(this.innerHTML);
  }); 
});
```
 can be written as:

 ```js
 $('.some-class').on('click', function(){ 
   console.log(this.innerHTML);
 });
 ```

 and in a better way, with event delegation:

 ```js
 $(document).on('click', '.some-class', function(){ 
   console.log(this.innerHTML);
 });
 ```

In bullet points, you can use DollarDOM, if:

- you want a jQuery style API to manage DOM selectors and event handling
- you need to use __[Event Delegation](https://learn.jquery.com/events/event-delegation/)__
- you need to generate DOM from string
- need to avoid the boilerplate code for above mentioned DOM APIs

## Install

using **npm**

    npm install --save dollar-dom

using **yarn**

    yarn add dollar-dom

If you're using module bundlers like webpack, Browserify or rollup, you can import `$` from DollarDom module:

```js
import {$} from 'dollar-dom';

// or

const {$} = require('dollar-dom');
```

If you wish to include as a script, DollarDOM can be included like this:

    unpkg.com/...

and will be available as a global object named **`dollarDom`** in the browser.

## API and Examples

### __`$`__

- **Create DOM from string:**

  Generating DOM from string is simple.

  ```js
  let newEl = $(`
    <div class="parent">
      <ul class="list">
        <li class="child">1</li>
        <li class="child">2</li>
        <li class="child">3</li>
        <li class="child">4</li>
        <li class="child">5</li>
      </ul>
      <div class="section">
        <span class="child">100</div>
      </div>
    </div>
  `)

  document.body.appendChild(newEl);
  ```

- **Single element selector ( same as querySelector ):**
  
  Let's try to find the element from the DOM we just created.

  ```js
  let parent = $('.parent');
  console.log( parent.tagName ) // logs 'DIV'
  ```

  You can limit the selector to any parent element

  ```js
  let child = $('.child', '.section');
  console.log( child.tagName ) // logs 'SPAN'

  // works with a parent dom element too
  let listElement = $('.list').get(0);
  let child = $('.child', listElement);
  console.log( child.tagName ) // logs 'LI'
  ```
- **Multiple elements selector ( same as querySelectorAll ):**

  ```js
  let children = $('.child');
  children.forEach( child => {
    console.log(child); // Logs LI, LI, LI, LI, LI, SPAN
  });

  // with a parent
  let children = $('.child', '.section');
  children.forEach( child => {
    console.log(child); // Logs SPAN
  });
  ```

- **Difference between a collection and a single element selector:**

  By default, `$` returns a collection. But you can call any DOM element method on it, and it will be applied on the 
  first element of the collection. However, if you call the `on` method ( which is dollarDOM specific ), it will be applied on all elements in the collection -- You can see that more in the `on` section.

  Example:

  ```js
    let out = $('.child', '.list');
    out.forEach( child => {
      console.log(child.innerHTML); // Logs 1, 2, 3, 4, 5
    });

    out.innerHTML = 'Hello';

    out.forEach( child => {
      console.log(child.innerHTML); // Logs Hello, 2, 3, 4, 5
    });
    
  ```

### __`on`__

- **Attach event handler:**

  `$` makes attaching the event handler a lot easy. If you're coming from the jQuery world, there won't be any surprices.

  ```js
  // Events will be attached to each .child element
  $('.child').on('click', function(e){
    console.log( this.textContent ) // NOTE: "this" points to the element clicked. Make sure not to use arrow function as a handler
    console.log( e ) // mouseClick event
  });
  ```

- **Remove event handler:**

  The output of the `on` method is a function which can be used to remove the attached event handlers.

  ```js
  let removeListeners = $('.child').on('click', function(e){
    console.log( this.textContent );
  });

  // remove attached event handlers
  removeListeners();
  ```

- **Event Delegation example:**

  In the above examples, the 'click' event will be attached in each `.child` element. This is not performance friendly. DollarDOM has built-in event delegation support ( The syntax is similar to jQuery event delegation ). 

  ```js
  // Only one event will be attached to the .parent element
  $('.parent').on('click', '.child', function(e){
    console.log( this.textContent ); // on click of the .child, it's textContent will be logged.
  });
  ```

### __`get`__

- **Get the element from collection:**

  `get` is a utility method to get a single element from the collection. It accept an `index` argument and the element in that position will be returned. 

  ```js
  let collection = $('.child');
  // NOTE: index starts from 0
  let spanElement = collection.get(5);
  console.log( spanElement.textContent ) // Logs 100
  ```

## Want to Contribute ?

We love contributions from everyone. 
  1. Fork the repo.
  2. Install dependencies. `yarn install` or `npm install`
  3. We use `AVA` for unit tests. 
      - To run unit tests, `yarn test` or `npm test`
      - To run unit test in --watch mode, `yarn test-w` or `npm run test-w`
  4. Implement the changes, and write test cases. Make sure that all unit test pass.
  5. To generate the final build, run `yarn build` or `npm build`.
  6. Push your code and create a Pull Request
      

## Licence

MIT @ [Namshi.com](tech.namshi.com)
