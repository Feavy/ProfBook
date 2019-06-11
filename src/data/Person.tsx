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

    constructor(id:string = "", avatar: string = "", prenom:string = "", nom:string = "", initiales:string = "", fonction:string = "Enseignant", formation:string = "DUT", modules:string[] = [], description:string = "") {
        this.id = id;
        this.prenom = prenom;
        this.avatar = avatar || "data:image/png;base64,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";
        this.nom = nom;
        this.initiales = initiales;
        this.fonction = fonction;
        this.formation = formation;
        this.modules = modules;
        this.description = description;
    }
    
}

export default Person;