const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect('mongodb+srv://Cluster82756:E1Agc%25Mghr@Cluster82756.js5lqya.mongodb.net/car_rental', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('MongoDB Connection Successful');
    })
    .catch((error) => {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1); // Exit process with failure
    });

    const connection = mongoose.connection;
    connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB');
    });
    connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
    });
}

module.exports = connectDB; // Export the function itself



// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(mongodb+srv:Cluster82756:E1Agc%25Mghr@cluster82756.js5lqya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster82756);
//     console.log("MongoDB connected...");
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
