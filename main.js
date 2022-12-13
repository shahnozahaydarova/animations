const { fromEvent } = rxjs;
const { map, startWith } = rxjs.operators;

const house = document.querySelector('#house');
const range = document.querySelector('#range');
const label = document.querySelector('#label');

const f = new Flipping();
const update = f.wrap(rooms => {
  const prevRooms = house.getAttribute('data-rooms');
  house.setAttribute('data-prev-rooms', prevRooms);
  house.setAttribute('data-rooms', rooms);

  label.setAttribute('data-prev-rooms', prevRooms);
  label.setAttribute('data-rooms', rooms);
  label.setAttribute('data-rooms-delta', rooms - prevRooms);
});

const range$ = fromEvent(range, 'input').
pipe(
map(e => e.target.value),
startWith(6));

range$.subscribe(update);