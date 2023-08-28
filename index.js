const { Sequelize, DataTypes} = require('sequelize');
const fs = require('fs');

const MYSQL_IP="localhost";
const MYSQL_LOGIN="root";
const MYSQL_PASSWORD="root";
const DATABASE = "auto_world";
const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD,{host:MYSQL_IP,port: 3306, dialect: "mysql"});

const Car = sequelize.define('Car', {
 id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
 model: {type: DataTypes.STRING},
 origin: {type: DataTypes.STRING},
 horsepower: {type: DataTypes.FLOAT },
 acceleration: {type: DataTypes.FLOAT }
 }, {tableName: 'cars',timestamps: false});

 async function run(){
    const fileContent = await fs.readFileSync('cars.csv', 'utf8');
    const lines = fileContent.split("\r\n");
    const dataLines = lines.slice(2, lines.length); //remover headers
    const cars = [];
    await Car.truncate();
    dataLines.forEach((dataLines) =>{
        const columns = dataLines.split(",");
        let car ={
            model: columns[0],
            horsepower: Number.parseFloat(columns[4]),
            acceleration: Number.parseFloat(columns[6]),
            origin: columns[8]
        }
        cars.push(car);
    });
    try{
        let result = await Car.bulkCreate(cars);
        let generatedIds = result.map(el => el.dataValues.id);
        console.log("generatedIds", generatedIds);
    }catch(e){
        console.error(e);
    }
 }
 run();
