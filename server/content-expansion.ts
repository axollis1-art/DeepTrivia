import type {Prompt,Difficulty,Category} from '../src/shared/types';
import {SCORING_VERSION} from '../src/shared/types';
import {normalise} from '../src/shared/core';
const easy=new Set('vegetables fruits legumes edible-seeds grains soups sauces japanese-food indian-food italian-dishes cakes pancakes british-puddings africa asia europe americas oceania us-states eu-2024 canada-divisions australia-divisions planets british-birds garden-plants tree-genera pasta herbs breads cheese nato-alphabet irregular-past dahl-books austen bond-films pixar-features instrument chess-pieces olympic-paris world-cup-winners'.split(' '));
const hard=new Set('physics-laureates minerals chemical-acids human-muscles seaweeds crocodilians indo-aryan classical-plurals rhetorical-devices architecture sculptures operas ballets sherlock-stories one-letter-elements si-units constellations penguins roman-gods f1-circuits'.split(' '));
const music=new Set('composers operas ballets musicals instrument'.split(' '));
const films=new Set('spielberg hitchcock nolan ghibli best-picture bond-films pixar-features'.split(' '));
const closed=new Set('eu-2024 nato-2024 state-capitals english-counties canada-divisions australia-divisions african-capitals asian-capitals european-capitals moonwalkers si-prefixes amino-acids cloud-genera crocodilians germanic-languages slavic-languages conjunctions punctuation greek-letters nato-alphabet austen dickens nolan ghibli bond-films pixar-features nfl-teams nba-teams mlb-teams nhl-teams africa asia europe americas oceania mediterranean landlocked us-states elements one-letter-elements noble-gases si-units constellations planets penguins chess-pieces olympic-paris athletics-events world-cup-winners'.split(' '));
// New names extend existing lists without mutating saved snapshots. Added
// common choices receive 10 points; more specialist examples receive 30/60.
const additions:Record<string,{common?:string;uncommon?:string;rare?:string}>={
 vegetables:{common:'Broccolini^Tenderstem broccoli|Mangetout^Snow pea|Sugar snap pea|Spring onion^Scallion',uncommon:'Romanesco|Tomatillo|Cavolo nero|Mizuna|Tatsoi|Chinese broccoli^Gai lan|Amaranth greens|Malabar spinach|Ahipa|Yacon'},
 fruits:{common:'Nectarine|Lemon|Lime|Satsuma|Honeydew melon|Cantaloupe|Coconut|Raisin|Prune|Red grape|Green grape',uncommon:'White sapote|Black sapote|Cupuacu|Pitanga|Jabuticaba|Physalis^Cape gooseberry|Huckleberry|Bilberry|Aronia^Chokeberry|Sea buckthorn|Serviceberry|Marionberry|Ugli fruit|Nance|Lucuma'},
 herbs:{common:'Garlic|Parsley|Basil|Oregano|Mint|Sage|Rosemary|Thyme|Ginger|Turmeric',uncommon:'Lemon thyme|Thai basil|Holy basil^Tulsi|Mexican oregano|Epazote|Culantro|Lemon verbena|Lovage|Summer savory|Winter savory|Cubeb|Grains of paradise|Sansho|Ajwain|Annatto'},
 breads:{common:'Garlic bread|White bread|Brown bread|Wholemeal bread|Soda bread|Pitta^Pita',uncommon:'Pide|Lavash|Sangak|Barbari|Taftan|Msemmen|Malawach|Lahoh|Bazlama|Pão de queijo^Pao de queijo|Pan de yuca|Damper|Barmbrack|Bannock|Knäckebröd^Knackebrod|Lefse|Tunnbröd^Tunnbrod'},
 cheese:{common:'Red Leicester|Double Gloucester|Cheshire|Wensleydale|Lancashire|Caerphilly',uncommon:'Stinking Bishop|Baron Bigod|Cornish Yarg|Oxford Blue|Shropshire Blue|Cashel Blue|Durrus|Gubbeen|Coolea|Saint Agur|Époisses^Epoisses|Mimolette|Taleggio|Asiago|Scamorza|Caciocavallo|Cotija|Oaxaca cheese|Queso fresco|Queso blanco'},
 cakes:{common:'Cupcake|Chocolate cake|Birthday cake|Victoria sandwich|Coffee cake|Carrot cake',uncommon:'Basque cheesecake|Burnt cheesecake|Hummingbird cake|Tres leches cake|Chocotorta|Medovik|Napoleon cake|Dobos torte|Esterházy torte^Esterhazy torte|Prinsesstårta^Princess cake|Kransekake|Kvæfjordkake^Kvaefjordkake|Bolo de rolo|Castella|Chiffon cake|Angel food cake|Genoise|Opera cake'},
 soups:{common:'Chicken soup|Tomato soup|Mushroom soup|Vegetable soup|Carrot and coriander soup|Lentil soup',uncommon:'Harira|Chorba|Mercimek çorbası^Mercimek corbasi|Sopa de ajo|Caldo gallego|Ajiaco|Sancocho|Pozole|Mulligatawny|Rasam|Soto ayam|Laksa|Bun bo Hue|Sinigang|Tinola|Sundubu jjigae'},
 sauces:{common:'Brown sauce|Salad cream|Cranberry sauce|Apple sauce|Mint sauce|Gravy|Tartare sauce^Tartar sauce',uncommon:'Ssamjang|Doenjang|Gochujang|XO sauce|Doubanjiang|Zhug|Shatta|Amba|Muhammara|Skordalia|Tarator|Agrodolce|Bagna cauda|Salmoriglio|Aji verde|Salsa macha|Mole poblano|Mojo verde|Mojo rojo'},
 'japanese-food':{common:'Katsu curry|Chicken katsu|Edamame|Sushi roll|Miso soup',uncommon:'Kushikatsu|Kushiage|Tonkatsu|Katsudon|Oyakodon|Gyudon|Nikujaga|Nimono|Chawanmushi|Ochazuke|Omurice|Hayashi rice|Goya champuru|Sata andagi|Dorayaki|Taiyaki|Daifuku|Warabi mochi'},
 'indian-food':{common:'Butter chicken|Chicken tikka masala|Chicken tikka|Aloo gobi|Saag paneer|Palak paneer',uncommon:'Pav bhaji|Vada pav|Misal pav|Dabeli|Khandvi|Patra|Undhiyu|Sarson ka saag|Makki ki roti|Litti chokha|Dal baati churma|Gatte ki sabzi|Kashmiri dum aloo|Gushtaba|Yakhni|Appam|Puttu|Avial|Erissery'},
 'italian-dishes':{common:'Spaghetti bolognese|Lasagna^Lasagne|Pizza margherita|Carbonara',uncommon:'Pasta alla Norma|Pasta con le sarde|Cacio e pepe|Pasta e fagioli|Pasta e ceci|Risi e bisi|Risotto alla milanese|Saltimbocca|Vitello tonnato|Fritto misto|Caponata|Panzanella|Ribollita|Cacciucco|Zuppa di pesce|Pasticciotto'},
 'british-birds':{common:'Green woodpecker|Greater spotted woodpecker^Great spotted woodpecker|Jackdaw|Rook|Raven|Collared dove|Feral pigeon',uncommon:'Tree sparrow|Bullfinch|Linnet|Siskin|Lesser redpoll|Brambling|Yellowhammer|Reed bunting|Cirl bunting|Corn bunting|Stonechat|Whinchat|Redstart|Black redstart|Nightingale|Cetti’s warbler|Blackcap|Chiffchaff|Willow warbler|Garden warbler|Reed warbler|Sedge warbler|Wood warbler|Wigeon|Teal|Gadwall|Shoveler|Pintail|Tufted duck|Pochard|Eider|Goldeneye|Goosander|Smew|Mandarin duck'},
 instrument:{common:'Electric guitar|Bass guitar|Acoustic guitar|Drum kit|Synthesiser^Synthesizer',uncommon:'Cajón^Cajon|Steel drum^Steelpan|Kalimba|Mbira|Kora|Duduk|Dizi|Suona|Gayageum|Guzheng|Hurdy-gurdy|Hammered dulcimer|Appalachian dulcimer|Hang drum|Handpan|Uilleann pipes|Bombarde|Shawm|Crumhorn|Serpent|Sackbut|Octobass'},
 'dance-styles':{common:'Line dance|Belly dance|Breakdance|Street dance|Irish dance',uncommon:'Kizomba|Zouk|Kuduro|Gumboot dance|Pantsula|Bhangra|Garba|Kathak|Bharatanatyam|Odissi|Kuchipudi|Mohiniyattam|Sattriya|Manipuri|Butoh|Hula|Siva|Haka|Tinikling|Binasuan'},
};
export function expandLegacy(original:Prompt):Prompt {
 const prompt=structuredClone(original);
 prompt.difficulty=(easy.has(prompt.id)?'easy':hard.has(prompt.id)?'hard':'medium') as Difficulty;
 if(prompt.category==='Film & books')prompt.category=(films.has(prompt.id)?'Films':'Books') as Category;
 if(music.has(prompt.id))prompt.category='Music';
 prompt.coverage=closed.has(prompt.id)?'complete':prompt.answers.length>=30?'broad':'flagged';
 prompt.coverageNotes=prompt.coverage==='complete'?'Finite reference set; retained legacy edition.':prompt.coverage==='broad'?'Open category with broad curated coverage; missing-answer reports remain available.':'Legacy open list has fewer than 30 answers and is excluded until expanded.';
 prompt.scoringVersion=SCORING_VERSION;
 const extra=additions[prompt.id];if(extra){
  const names=new Set(prompt.answers.flatMap(a=>[a.canonical,...a.aliases].map(normalise)));
  for(const [label,items] of Object.entries(extra))for(const item of items.split('|')){
   const [canonical,...aliases]=item.split('^');const existing=prompt.answers.find(a=>[a.canonical,...a.aliases].some(n=>normalise(n)===normalise(canonical)));
   if(existing){for(const alias of aliases)if(!names.has(normalise(alias))){existing.aliases.push(alias);names.add(normalise(alias));}continue;}
   if([canonical,...aliases].some(n=>names.has(normalise(n))))continue;
   const tier=label==='common'?'familiar':label==='uncommon'?'uncommon':'rare';
   prompt.answers.push({id:prompt.id+'-extra-'+normalise(canonical),canonical,aliases,tier,explanation:`${canonical} is a valid example for this category. ${prompt.qualificationNotes}`,rarityRationale:`Editorial ${tier} tier based on expected UK familiarity, without measured popularity.`});for(const n of [canonical,...aliases])names.add(normalise(n));
  }
  prompt.version+=1;if(prompt.answers.length>=30)prompt.coverage='broad';
  prompt.sources.push({title:'Expanded reference catalogue',url:prompt.category==='Music'?'https://www.metmuseum.org/art/collection/search?department=18':prompt.category==='Nature'?'https://www.rspb.org.uk/birds-and-wildlife/a-z':prompt.category==='Culture'?'https://www.britannica.com/art/dance': 'https://www.bbcgoodfood.com/glossary',checkedOn:'2026-10-09'});
 }
 // Apply safe singular/plural forms only to named count nouns, never every
 // title, mass noun or word ending in s. Explicit irregulars are curated.
 const irregular:Record<string,string>={Mouse:'Mice',Goose:'Geese',Wolf:'Wolves',Leaf:'Leaves',Knife:'Knives',Foot:'Feet',Tooth:'Teeth'};
 const counts=new Set('Carrot Potato Onion Tomato Pea Courgette Aubergine Cucumber Chilli Parsnip Leek Radish Apricot Banana Apple Pear Peach Plum Grape Mango Pineapple Lemon Lime Dog Cat Horse Rabbit Lion Tiger Bird Duck Swan Owl Parrot Hamster Kitten Puppy Cupcake Pancake Biscuit Cookie Mushroom Sausage Egg Anchovy Sardine Prawn Oyster Mussel Scallop'.split(' '));
 const claimed=new Set(prompt.answers.flatMap(a=>[a.canonical,...a.aliases].map(normalise)));
 for(const a of prompt.answers){const plural=irregular[a.canonical]??(counts.has(a.canonical)?a.canonical.endsWith('o')?a.canonical+'es':a.canonical.endsWith('y')&&!/[aeiou]y$/.test(a.canonical)?a.canonical.slice(0,-1)+'ies':/(s|x|ch|sh)$/.test(a.canonical)?a.canonical+'es':a.canonical+'s':undefined);if(plural&&!claimed.has(normalise(plural))){a.aliases.push(plural);claimed.add(normalise(plural));}}
 if(prompt.coverage==='flagged')prompt.reviewed=false;
 return prompt;
}
