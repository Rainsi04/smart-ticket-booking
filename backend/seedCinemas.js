const mongoose = require('mongoose');
const Cinema = require('./models/Cinema');
const dotenv = require('dotenv');

dotenv.config();

const cinemas = [
    {
        name: 'PVR Pacific Mall',
        city: 'Dehradun',
        address: 'Pacific Mall, Rajpur Road, Dehradun, Uttarakhand 248001',
        screens: 6
    },
    {
        name: 'INOX Pacific Mall',
        city: 'Dehradun',
        address: 'Pacific Mall, Rajpur Road, Dehradun, Uttarakhand 248001',
        screens: 5
    },
    {
        name: 'Glitz Cinemas',
        city: 'Dehradun',
        address: 'Glitz Mall, Saharanpur Road, Govind Nagar, Dehradun 248001',
        screens: 4
    },
    {
        name: 'SilverCity Multiplex',
        city: 'Dehradun',
        address: 'SilverCity Mall, Haridwar Road, Ajabpur Kalan, Dehradun 248121',
        screens: 5
    },
    {
        name: 'Ewave Cinemas',
        city: 'Dehradun',
        address: 'Ewave Building, Rajpur Road, Hathibarkala, Dehradun 248001',
        screens: 3
    },
    {
        name: 'Cinepolis Crossroads',
        city: 'Dehradun',
        address: 'Crossroads Mall, GMS Road, Ballupur Chowk, Dehradun 248001',
        screens: 4
    }
];

async function seedCinemas() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartticket');
        await Cinema.deleteMany();
        await Cinema.insertMany(cinemas);
        console.log('✅ Cinemas seeded successfully!');
        console.log(`📊 Added ${cinemas.length} cinemas in Dehradun`);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding cinemas:', error);
        process.exit(1);
    }
}

seedCinemas();
