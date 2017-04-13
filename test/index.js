import test from 'ava';
import $dom from '../index';
const {$, on} = $dom;

test.beforeEach(t => {
  document.body.innerHTML = '';
});

test('module exist and sane', t => {
  t.truthy(typeof $dom === 'object','Module doesnt exist');
  t.truthy(typeof $ === 'function','$ function doesnt exist');
  t.truthy(typeof on === 'function','on function doesnt exist');
});

// Create DOM

test('$ can create dom elements', t => {
  let div = $('<div></div>');
  t.truthy(div.tagName === 'DIV', 'not able to create DOM element');
});

// DOM Selectors

test('it can do querySelectorAll', t => {
  let div = $('<div class="test">TESTDOM</div>');
  let div2 = $('<div class="test">TESTDOM2</div>');
  document.body.appendChild(div);
  document.body.appendChild(div2);
  let elem = $('.test');
  t.truthy( elem.length === 2, 'number of dom elements not matching');
  t.is(typeof elem.forEach, 'function', 'output is an array');
  t.is(elem[0].textContent, 'TESTDOM', 'couldnt find matching element');
  t.is(elem[1].textContent, 'TESTDOM2', 'couldnt find matching element');
});

test('it can run the querySelectorAll with a parent ', t => {
  let div = $('<div class="test">TESTDOM</div>');
  let div2 = $('<div class="parent"><span class="test">TESTDOM2</span></div>');
  document.body.appendChild(div);
  document.body.appendChild(div2);
  let elem = $('.test', '.parent');
  t.truthy( elem.length === 1, 'number of dom elements not matching');
  t.is(elem[0].textContent, 'TESTDOM2', 'couldnt find matching element');
  t.is(elem[0].tagName, 'SPAN', 'couldnt find matching element');

  let elem2 = $('.test', $('.parent').get(0));
  t.truthy( elem2.length === 1, 'number of dom elements not matching');
  t.is(elem2[0].textContent, 'TESTDOM2', 'couldnt find matching element');
  t.is(elem2[0].tagName, 'SPAN', 'couldnt find matching element');
});

test('it can do querySelector and return a single element', t => {
  let div = $('<div class="single">NEWDOM</div>');
  let div2 = $('<div class="single">NEWDOM2</div>');
  document.body.appendChild(div);
  document.body.appendChild(div2);
  let elem = $('.single');
  t.is(elem.length, 2, 'Not able to get the first element');
  t.is(elem.get(1), div2, 'Not able to get the the index element');
  t.is(elem.textContent, 'NEWDOM', 'first element is returned properly');
  elem.forEach( el => {
    el.innerHTML = 'TEST';
  });
  t.is(elem.textContent, 'TEST', 'element did not get updated properly');
  t.is(elem.get(1).textContent, 'TEST', 'element did not get updated properly');
});

// Event handlers

test('it can attach event handlers', t => {
  document.body.appendChild($('<div class="event-handler">NEWDOM</div>'));
  let elem = $('.event-handler');
  t.is(typeof elem.on, 'function', 'No event attaching method found');
  let counter = 0;
  let removeHandler = elem.on('click', function() {
    counter++;
  });
  t.is(typeof removeHandler, 'function', 'No remove event handler found');
  elem.click();
  t.is(counter, 1);
  elem.click();
  t.is(counter, 2);
  removeHandler();
  elem.click();
  t.is(counter, 2);
});

test('it can attach event handlers to all elements', t => {
  document.body.appendChild($(`
  <div class="parent">
    <div class="c-event">1</div>
    <div class="c-event">2</div>
  </div>
  `));
  let elem = $('.c-event');
  let counter = 0;
  let removeHandler = elem.on('click', function() {
    counter += Number(this.textContent);
  });
  elem.click();
  t.is(counter, 1);
  elem.get(1).click();
  t.is(counter, 3);
});

test('it can do event delegation', t => {
  let html = `
  <div class="root">
    <div class="child">1</div>
    <div class="nested">
      <div class="child">2</div>
    </div>
    <div class="child">
      <span class="nested-child">3</span>
    </div>
    <div class="child">
      <span class="nested-child-1">
        <a><i class="inner">10</i></a>
      </span>
    </div>
  </div>`;
  document.body.appendChild($(html));
  let counter = 0;
  $('.root').on('click', '.child', function(){
    let val = Number( this.textContent );
    counter+= val;
  });
  let elems = $('.child');
  elems.get(1).click();
  t.is(counter, 2);
  $('.nested-child').click();
  t.is(counter, 5);
  $('.inner').click();
  t.is(counter, 15);
});