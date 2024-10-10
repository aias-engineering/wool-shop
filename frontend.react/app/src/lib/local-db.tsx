import Datastore from "nedb-promises";

const productsDb = Datastore.create({filename: './products.db', autoload: true});

export const getProducts = async () => productsDb.find({});