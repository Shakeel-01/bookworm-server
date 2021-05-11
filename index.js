const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const ObjectId= require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
const port = 5000|| process.env.PORT



app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gvyyl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("bookdb").collection("books");
  const ordersCollection = client.db("bookdb").collection("orders");

  app.get('/books',(req,res)=>{
    booksCollection.find()
    .toArray((err,books)=>{
      res.send(books)
    })
  })

  app.get('/book/:id',(req,res)=>{
    const id = ObjectId(req.params.id);
    booksCollection.find({_id:id})
    .toArray((err,book)=>{
      res.send(book[0])
    })
  })


  app.post('/addOrder',(req,res)=>{
    const newOrder = req.body;
    console.log(newOrder)
    ordersCollection.insertOne(newOrder)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })

  app.get('/orders',(req,res)=>{
      ordersCollection.find({email:req.query.email})
      .toArray((err,documents)=>{
        res.send(documents)
      })
  })


  app.post('/addBook',(req,res)=>{
    const newBook = req.body;
    console.log('adding book',newBook)
    booksCollection.insertOne(newBook)
    .then(result=>{
      console.log('inserted count',result.insertedCount)
      res.send(result.insertedCount>0)
    })
   
  })

  app.delete('/delete/:id',(req,res)=>{
    const id = ObjectId(req.params.id);
    booksCollection.deleteOne({_id:id})
    .then(result=>{
      res.send(result.deletedCount>0)
    })
  })
 //   client.close();
});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)