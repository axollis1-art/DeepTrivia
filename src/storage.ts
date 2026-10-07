export let storageAvailable=true;
export function read<T>(key:string,fallback:T):T{try{const raw=localStorage.getItem(`deep:${key}`);return raw?JSON.parse(raw):fallback;}catch{storageAvailable=false;return fallback;}}
export function save(key:string,value:unknown){try{localStorage.setItem(`deep:${key}`,JSON.stringify(value));return true;}catch{storageAvailable=false;return false;}}
export function remove(key:string){try{localStorage.removeItem(`deep:${key}`);}catch{storageAvailable=false;}}
