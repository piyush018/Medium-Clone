export interface Post{
    _id : string;
    _createdAt : string;
    title : string ;
    author : {
        name : string;
        image : sttring ;
    };
    comments : Comment[], 
    description : string;
    mainImage : {
        assest : {
            url :string;
        };
    };
    slug : {
        current : string ;
    };
    body : [objet];
}

export interface Comment{
    approved : boolean,
    _id : string ,
    _rev : string ,
    _type :string ,
    _createdAt : string ,
    comment : string ,
    eamil : string ,
    name : string ,
    _updatedAt : string,
    post : {
        _ref : string ,
        _type : string 
    }



}