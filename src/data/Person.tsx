class Person {
    public id:string;
    public prenom:string;
    public nom:string;
    public avatar:string;
    public initiales:string;
    public fonction:string;
    public formation:string;
    public modules:string[];
    public description:string;

    constructor(id:string, avatar: string, prenom:string, nom:string, initiales:string, fonction:string, formation:string, modules:string[], description:string) {
        this.id = id;
        this.prenom = prenom;
        this.avatar = avatar;
        this.nom = nom;
        this.initiales = initiales;
        this.fonction = fonction;
        this.formation = formation;
        this.modules = modules;
        this.description = description;
    }
}

export default Person;