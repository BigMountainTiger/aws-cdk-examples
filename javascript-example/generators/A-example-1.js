// https://javascript.info/generators

function* generateSequence() {
    let i = 0;
    const manipulator = () => {
        return ++i;
    };

    while (i < 3) {
        yield manipulator();
    }
}


let generator = generateSequence();
console.log(generator);

console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log('done=true entry have no valid data in it');
console.log()

generator = generateSequence();
console.log(generator.next());
console.log(generator.return(100));
console.log(generator.next());
console.log('return() done it immediately');
console.log()

console.log('A new generator instance here, use iterator')
generator = generateSequence();
for (const value of generator) {
    console.log(value);
}

console.log(generator.next());