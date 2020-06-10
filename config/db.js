const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDb = async () => {
    try{
        await mongoose.connect(db, { 
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
            useFindAndModify: false,
        });
        console.log("Database connected!");
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

mongoose.set('useCreateIndex', true);

module.exports = connectDb;
