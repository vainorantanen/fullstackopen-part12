db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('persons');

db.persons.insert({ name: 'Eka ukko', number: '050-1235567' });
db.persons.insert({ name: 'Toka ukko', number: '070-1336567' });