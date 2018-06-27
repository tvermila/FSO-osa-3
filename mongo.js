
//uuden henkilön tallennus kantaan
if(process.argv.length > 2){
    const nimi = process.argv[2]
    const numero = process.argv[3]
    const person = new Person({
        name: nimi,
        number: numero
    })
    console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
  person
  .save()
  .then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}else {
  //tietojen lukeminen kannasta, jos ei annettu uuden henkilön tietoja
  Person
  .find({})
  .then(result => {
    console.log('puhelinluettelo:')
      result.forEach(person => {          
          console.log(`${person.name} ${person.number}`)
      });
      mongoose.connection.close()
  })
}