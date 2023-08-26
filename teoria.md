const obj = {
  id: 1,
  name: 'Juan',
  pepito: 20
}

const { name, id, pepito } = obj // Destructuring
console.log(name) // 'Juan'
console.log(id) // 1
console.log(pepito) // 20


const arr = [
  "Pepe",
  "Juan",
  "Nico"
];

const [ pepe ] = arr;
console.log(Pepe) // "Pepe"


const users = {
  user1: { name: 'Nico', age: 25 },
  user2: { name: 'Juan', age: 24 },
  user3: { name: 'Pepe', age: 30 },
}

for (const user in users) {
  console.log(users[user].age)
}


const  user1  = users.user1.name;

console.log(user1);
console.log(user2);
console.log(user3);