import type {Prompt} from '../src/shared/types';
import {normalise} from '../src/shared/core';
// Open drafts remain available for editorial review, but never enter a new run.
const gaps:Record<string,string>={
 'goldfish-varieties':'Variety nomenclature differs between registries; the short list is not exhaustive.',
 'guinea-pig-breeds':'Breed and coat standards differ; broader source-level review required.',
 'origami-bases':'Traditional base catalogues are not a fixed closed set.',
 'nautical-directions':'Vocabulary is open; expand beyond the current short list.',
 'rail-gauges':'Many historic local gauges are missing; not a closed set.',
 'pooh-animals':'Named and imagined animals need a stricter boundary and full story-level index.',
 'water-cycle-processes':'Diagrams include different processes; the short list needs a fixed source scope.',
};
const plurals:Record<string,string>={Child:'Children',Mouse:'Mice',Goose:'Geese',Tooth:'Teeth',Wolf:'Wolves',Leaf:'Leaves',Knife:'Knives',Foot:'Feet',Calf:'Calves',Sheep:'Sheep'};
const countNouns=new Set('Dog Cat Horse Cow Sheep Pig Rabbit Lion Tiger Elephant Giraffe Bear Bird Duck Chicken Eagle Owl Penguin Parrot Robin Pigeon Swan Crow Goat Rat Hamster Donkey Zebra Monkey Gorilla Chimpanzee Dolphin Whale Seal Bat Snake Lizard Turtle Tortoise Gecko Chameleon Ant Bee Wasp Butterfly Moth Fly Mosquito Ladybird Beetle Grasshopper Cricket Dragonfly Termite Earwig Flea Kitten Puppy Calf Lamb Piglet Chick Foal Cub Duckling Chair Table Bed Sofa Wardrobe Desk Stool Bench Shirt Skirt Coat Jacket Sock Shoe Boot Trainer Sandal Slipper Pen Pencil Notebook Ruler Stapler Brush Spade Shovel Rake Hoe Fork Trowel Car Bus Train Bicycle Motorcycle Van Taxi Boat Tram Tractor Ferry Ship Helicopter Glider Scooter Moped Canoe Kayak Yacht Cupcake Biscuit Cookie Egg Prawn Crab Lobster Mussel Oyster Scallop Clam Squid Mushroom'.split(' '));
export function reviewPrompt(p:Prompt):Prompt {
 const intermediate=new Set('rabbit-breeds horse-breeds norse-deities tempo-markings indian-food japanese-food italian-dishes french-pastry mushrooms legumes grains cheese pasta german-cities french-cities'.split(' '));
 if(intermediate.has(p.id)&&p.difficulty==='easy')p.difficulty='medium';
 if(p.id==='wimbledon-men'){p.coverage='complete';p.reviewed=true;p.coverageNotes='Closed set of Open Era winners through Wimbledon 2024.';}
 if(['greek-letters','prepositions','conjunctions'].includes(p.id))p.difficulty='easy';
 if(gaps[p.id]){p.coverage='flagged';p.coverageNotes=gaps[p.id];p.reviewed=false;}
 const names=new Set(p.answers.flatMap(a=>[a.canonical,...a.aliases].map(normalise)));
 for(const a of p.answers){const singular=a.canonical;const plural=plurals[singular]??(countNouns.has(singular)?singular.endsWith('y')&&!/[aeiou]y$/.test(singular)?singular.slice(0,-1)+'ies':/(s|x|ch|sh)$/.test(singular)?singular+'es':singular+'s':undefined);if(plural&&!names.has(normalise(plural))){a.aliases.push(plural);names.add(normalise(plural));}}
 if(p.id==='weekdays')for(const a of p.answers)a.aliases.push(a.canonical.slice(0,3));
 if(p.id==='months')for(const a of p.answers)if(a.canonical!=='May')a.aliases.push(a.canonical.slice(0,3));
 if(p.id==='occupations')for(const a of p.answers){const plural=a.canonical==='Midwife'?'Midwives':a.canonical.endsWith('man')?a.canonical.slice(0,-3)+'men':a.canonical+'s';a.aliases.push(plural);if(a.canonical==='Actor')a.aliases.push('Actress','Actresses');if(a.canonical==='Waiter')a.aliases.push('Waitress','Waitresses');if(a.canonical==='Firefighter')a.aliases.push('Fireman','Firewoman');if(a.canonical==='Police officer')a.aliases.push('Policeman','Policewoman');}
 if(p.id==='dice-opposites'){p.answers[0].aliases.push('Six and one','6 and 1','6 1');p.answers[1].aliases.push('Five and two','5 and 2','5 2');p.answers[2].aliases.push('Four and three','4 and 3','4 3');}
 return p;
}
