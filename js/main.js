const $ = document.querySelector.bind(document);
const c = document.createElement.bind(document);
const el = {
  button: $('button'),
  pokeName: $('.pokeName'),
  input: $('input'),
  pokeType: $('.pokeType')
}


const getSpriteDetails = async name =>{
  let response = await (await fetch("https://pokeapi.co/api/v2/pokemon/" + name)).json();
  console.log(response);
  return {name: name, sprite: {front: response.sprites.front_default, back: response.sprites.back_default}};
}
const getFetch = async ()=>{
  const choice = el.input.value.toLowerCase();
  el.pokeName.innerText = choice;
  const url = "https://pokeapi.co/api/v2/pokemon/" + choice;
  let dataChoice = await (await fetch(url)).json()
  let dataPokeSpecies = await (await fetch(dataChoice.species.url)).json();
  let dataPokeEvo  = await (await fetch(dataPokeSpecies.evolution_chain.url)).json();
  let evoBegin = dataPokeEvo.chain;
  let initialEvo = evoBegin.species.name;
  let names = dataPokeEvo.chain.evolves_to.flatMap(ev=>ev.species.name ); //gets array of names.
  let namesAndSprites = await Promise.all(names.map(async name=>await getSpriteDetails(name)));
  el.pokeType.innerHTML = "";
  namesAndSprites.forEach((pokemon,i)=>{
    setTimeout(function(){
      let d = c('div');
      let p = c('p');
      let i = c('img');
      p.innerText = pokemon.name;
      i.className='pokePokePOKE';
      i.src= pokemon.sprite.front;
      i.dataset.front =  pokemon.sprite.front;
      i.dataset.back =  pokemon.sprite.back;
      d.className = 'pokeDiv';
      d.addEventListener('mouseenter',showPokeBooty);
      d.addEventListener('mouseleave',hidePokeBooty);
      d.append(p,i);
      el.pokeType.appendChild(d);

    },i* 200);
  })
}
const showPokeBooty = e=>{  e.target.children[1].src =   e.target.children[1].dataset.back;}
const hidePokeBooty = e=>{  e.target.children[1].src =   e.target.children[1].dataset.front;}

el.button.addEventListener("click", getFetch);