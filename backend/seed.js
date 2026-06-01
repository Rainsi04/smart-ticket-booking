const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const dotenv = require('dotenv');

dotenv.config();

const movies = [
    {
        title: "Interstellar",
        rating: 8.6,
        genre: "Sci-Fi/Drama",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        duration: "2h 49m",
        price: 350,
        poster: "images/movies/interstellar.jpg"
    },
    {
        title: "Inception",
        rating: 8.8,
        genre: "Sci-Fi/Action",
        synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
        duration: "2h 28m",
        price: 320,
        poster: "images/movies/inception.jpg"
    },
    {
        title: "The Dark Knight",
        rating: 9.0,
        genre: "Action/Crime",
        synopsis: "When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest psychological tests.",
        duration: "2h 32m",
        price: 340,
        poster: "images/movies/dark-knight.jpg"
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        rating: 9.0,
        genre: "Fantasy/Adventure",
        synopsis: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam.",
        duration: "3h 21m",
        price: 380,
        poster: "images/movies/lord-of-the-rings.jpg"
    },
    {
        title: "The Matrix",
        rating: 8.7,
        genre: "Sci-Fi/Action",
        synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
        duration: "2h 16m",
        price: 300,
        poster: "images/movies/matrix.jpg"
    },
    {
        title: "The Prestige",
        rating: 8.5,
        genre: "Drama/Mystery",
        synopsis: "Two stage magicians engage in a bitter rivalry leading to tragic consequences.",
        duration: "2h 10m",
        price: 260,
        poster: "images/movies/prestige.jpg"
    },
    {
        title: "Dune: Part Two",
        rating: 8.7,
        genre: "Sci-Fi/Adventure",
        synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.",
        duration: "2h 46m",
        price: 360,
        poster: "images/movies/dune-part-two.jpg"
    },
    {
        title: "Parasite",
        rating: 8.6,
        genre: "Thriller/Drama",
        synopsis: "Greed and class discrimination threaten the relationship between the wealthy Park family and the destitute Kim clan.",
        duration: "2h 12m",
        price: 280,
        poster: "images/movies/parasite.jpg"
    },
    {
        title: "Everything Everywhere All At Once",
        rating: 8.7,
        genre: "Sci-Fi/Comedy",
        synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure where she alone can save existence.",
        duration: "2h 19m",
        price: 290,
        poster: "images/movies/everything-everywhere.jpg"
    },
    {
        title: "Spider-Man: Across the Spider-Verse",
        rating: 8.7,
        genre: "Animation/Action",
        synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.",
        duration: "2h 20m",
        price: 310,
        poster: "images/movies/spider-man-across-the-spider-verse.jpg"
    },
    {
        title: "Oppenheimer",
        rating: 8.5,
        genre: "Biography/Drama",
        synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        duration: "3h 0m",
        price: 340,
        poster: "images/movies/oppenheimer.jpg"
    },
    {
        title: "Avatar: The Way of Water",
        rating: 7.6,
        genre: "Sci-Fi/Adventure",
        synopsis: "Jake Sully and Neytiri have formed a family and are doing everything to stay together when an old threat returns to Pandora.",
        duration: "3h 12m",
        price: 370,
        poster: "images/movies/avatar-way-of-water.jpg"
    },
    {
        title: "Top Gun: Maverick",
        rating: 8.3,
        genre: "Action/Drama",
        synopsis: "After thirty years, Maverick is still pushing the envelope as a top naval aviator training a new generation of elite pilots.",
        duration: "2h 11m",
        price: 330,
        poster: "images/movies/top-gun-maverick.jpg"
    },
    {
        title: "Barbie",
        rating: 7.0,
        genre: "Comedy/Fantasy",
        synopsis: "Barbie suffers a crisis that leads her to question her world and her existence in this vibrant adventure.",
        duration: "1h 54m",
        price: 300,
        poster: "images/movies/barbie.jpg"
    },
    {
        title: "Joker",
        rating: 8.4,
        genre: "Crime/Drama",
        synopsis: "In Gotham City, a failed comedian descends into madness and transforms into a criminal mastermind.",
        duration: "2h 2m",
        price: 310,
        poster: "images/movies/joker.jpg"
    },
    {
        title: "Spirited Away",
        rating: 8.6,
        genre: "Anime/Fantasy",
        synopsis: "During her family's move to the suburbs, a sullen girl wanders into a world ruled by gods, witches, and spirits.",
        duration: "2h 5m",
        price: 290,
        poster: "images/movies/spirited-away.jpg"
    },
    {
        title: "Demon Slayer: Mugen Train",
        rating: 8.2,
        genre: "Anime/Action",
        synopsis: "Tanjiro and his companions board the Mugen Train to aid the Flame Hashira in defeating a demon who traps passengers in dreams.",
        duration: "1h 57m",
        price: 320,
        poster: "images/movies/demon-slayer-mugen-train.jpg"
    },
    {
        title: "Your Name",
        rating: 8.4,
        genre: "Anime/Romance",
        synopsis: "Two teenagers share a profound connection when they begin swapping bodies mysteriously across distances.",
        duration: "1h 46m",
        price: 280,
        poster: "images/movies/your-name.jpg"
    },
    {
        title: "Akira",
        rating: 8.0,
        genre: "Anime/Sci-Fi",
        synopsis: "A secret military project endangers Neo-Tokyo when a biker gang member gains terrifying psychic powers.",
        duration: "2h 4m",
        price: 270,
        poster: "images/movies/akira.jpg"
    },
    {
        title: "My Neighbor Totoro",
        rating: 8.1,
        genre: "Anime/Family",
        synopsis: "Two young girls discover friendly forest spirits while their mother recovers from an illness in rural Japan.",
        duration: "1h 26m",
        price: 260,
        poster: "images/movies/my-neighbor-totoro.jpg"
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartticket');
        await Movie.deleteMany();
        await Movie.insertMany(movies);
        console.log('✅ Database seeded successfully!');
        console.log(`📊 Added ${movies.length} movies to the database`);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();