const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());

let movies = [
    {id:1, title:"Pulp Fiction", description:"The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", year:"1994", rating:"92%"},
    {id:2, title:"Moonrise Kingdom", description:"A pair of young lovers flee their New England town, which causes a local search party to fan out to find them.", year:"2012", rating:"93%"},
    {id:3, title:"Taxi Driver", description:"A mentally unstable veteran works as a nighttime taxi driver in New York City, where the perceived decadence and sleaze fuels his urge for violent action by attempting to liberate a presidential campaign worker and an underage prostitute.", year:"1976", rating:"97%"},
    {id:4, title:"Monty Python and the Holy Grail", description:"King Arthur (Graham Chapman) and his Knights of the Round Table embark on a surreal, low-budget search for the Holy Grail, encountering many, very silly obstacles.", year:"1975", rating:"97%"},
    {id:5, title:"Blade Runner", description:"A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.", year:"1982", rating:"90%"},
    {id:6, title:"12 Angry Men", description:" jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.", year:"1957", rating:"100%"}
];

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/movies', (req,res)=>{
    res.send(movies);
});

app.get('/api/movies/:id', (req,res)=>{
    const movie = movies.find(m => m.id === parseInt(req.params.id));

    if(!movie) res.status(404).send("The movie with the given id was not found");

    res.send(movie);
});

app.post('/api/movies', (req, res)=>{
    const result = validateMovie(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const movie = {
        id:movies.length+1,
        title:req.body.title,
        year:req.body.year,
        rating:req.body.rating,
        description:req.body.description
    };

    movies.push(movie);
    res.send(movie);
});

app.put('/api/movies/:id', (req,res)=>{
    const movie = movies.find(r=>r.id === parseInt(req.params.id));

    if(!movie) res.status(404).send("Movie with given id was not found");

    const result = validateMovie(req.body);

    if(result.error){
        res.status(400).send(results.error.details[0].message);
        return;
    }

    movie.title = req.body.title;
    movie.year = req.body.year;
    movie.rating = req.body.rating;
    movie.description = req.body.description;
    res.send(movie);
});

app.delete('/api/movies/:id',(req,res)=>{
    const movie = movies.find(r=>r.id===parseInt(req.params.id));

    if(!movie){
        req.status(404).send("This movie with the given id was not found");
    }

    const index = movies.indexOf(movie);
    movies.splice(index,1);

    res.send(movie);
});

function validateMovie(movie){
    const schema = {
        title:Joi.string().min(3).required(),
        year:Joi.string().min(4).required(),
        rating:Joi.string().min(1).required(),
        description:Joi.string().min(3).required()
    };

    return Joi.validate(movie,schema);
}

//Setting up server
app.listen(3000, ()=>{
    console.log("Listening on port 3000...");
})