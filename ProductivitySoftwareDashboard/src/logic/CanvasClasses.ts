


//I need a class that first fetches, and creates the original classes. The classObject need to be stored somewhere in the program
//problem is that the classes are stateless, so the only thing that you can really store is the data necessary for the 
//constructor
//so I need a function that first fetches all the classes and returns an array of classObjects
//I then store the constructor data in my own backend
//


export class Class{
    id: number;
    name: string;
    proffesor: string;
    //so I will change 
    constructor(id: number, name: string, proffesor: string){
        this.id = id;
        this.name = name;
        this.proffesor = proffesor;
    }

    grader(): number {
        //here I put the logic that fetches the logic from th canvas API
        //it does this by comparing with the classes stored ID

        return 100;
    }

}