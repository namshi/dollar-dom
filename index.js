const HTML_REGEX = /^\<.*\>$/m;
const domFactory = document.createElement('div');

const closest = (event, selector) => {
  let {target} = event;
  while(target && target !== document.body){
    if(target.matches && target.matches(selector)){
      break;
    } else {
      target = target.parentNode;
    }
  }
  return target;
}

const generateDOM = str => {
  domFactory.innerHTML = str;
  return domFactory.childNodes ? domFactory.childNodes[0] : null;
};

const generateHandler = ({ elem, handler, childSelector }) => {
  if(!childSelector){
    return handler.bind(elem);
  }
  return (...args) => {
    let target = closest(args[0], childSelector);
    if(target){
      return handler.apply(target, args);
    }
  }
};

const $ = (args, parent) => {
  args = args.trim();
  if(HTML_REGEX.test(args)) {
    return generateDOM(args);
  }
  parent = typeof parent === 'string' ? document.querySelector(parent) : parent;
  let collection =  Array.from(
    (parent || document).querySelectorAll(args)
  );

  let firstElem = collection[0];
  for(let prop in firstElem){
    Object.defineProperty(collection, prop, 
      typeof firstElem[prop] === 'function' ?
      {
        value: firstElem[prop].bind(firstElem)
      } :
      {
        get(){
          return firstElem[prop];
        },
        set(v){
          firstElem[prop] = v;
        }
      }
    )
  }

  Object.defineProperties(collection, {
    'get': {
      value: function(index){
        return collection[index];
      }
    },
    'on': {
      value: function(...args){
        let removeHandlers = collection.map(elem => on(elem, ...args));
        return () => {
          removeHandlers.forEach(fn => fn());
        };
      }
    }
  })

  return collection;
};

const on = (elem, event, ...args) => {
  let handler, childSelector;
  handler = args.shift();
  if( typeof handler !== 'function' ){
    childSelector = handler;
    handler = args.shift();
  }

  handler = generateHandler({ elem, handler, childSelector });
  elem.addEventListener(event, handler);
  return () => {
    elem.removeEventListener(event, handler);
  }
};

export default {
  $,
  on
};